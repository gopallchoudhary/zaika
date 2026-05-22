import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'

const OrdersScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>OrdersScreen</Text>
    </SafeAreaView>
  )
}

export default OrdersScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});