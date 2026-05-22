import React from "react";
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from "react-native";
import { colors, fonts, typography } from "../../constants/theme";

export interface TextProps extends RNTextProps {
  variant?: "regular" | "medium" | "semibold" | "bold";
  color?: keyof typeof colors | string;
  size?: keyof typeof typography.sizes | number;
  align?: "auto" | "left" | "right" | "center" | "justify";
}

export const Text = ({
  variant = "regular",
  color = "charcoal",
  size = "md",
  align = "auto",
  style,
  ...props
}: TextProps) => {
  const resolvedFontFamily = fonts[variant] || fonts.regular;
  const resolvedColor = (colors as Record<string, string>)[color] || color;
  const resolvedFontSize = typeof size === "number" ? size : typography.sizes[size] || typography.sizes.md;
  
  // Resolve line height based on size key if standard
  const resolvedLineHeight = typeof size === "string" 
    ? typography.lineHeights[size as keyof typeof typography.lineHeights] 
    : undefined;

  const textStyle: TextStyle = {
    fontFamily: resolvedFontFamily,
    color: resolvedColor,
    fontSize: resolvedFontSize,
    textAlign: align,
    ...(resolvedLineHeight ? { lineHeight: resolvedLineHeight } : {}),
  };

  return <RNText style={[textStyle, style]} {...props} />;
};

export default Text;
