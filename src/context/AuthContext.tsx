import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../data/types";

interface AuthContextType {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      const [storedAuth, storedOnboarding, storedUser] = await Promise.all([
        AsyncStorage.getItem("@auth_authenticated"),
        AsyncStorage.getItem("@auth_onboarding"),
        AsyncStorage.getItem("@auth_user"),
      ]);

      if (storedAuth === "true") {
        setIsAuthenticated(true);
      }
      if (storedOnboarding === "true") {
        setHasCompletedOnboarding(true);
      }
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to load auth state", e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Validate against mock user credentials
    if (email.toLowerCase() === "gopalchaudhary@example.com" && password === "232hod#ld3o") {
      const mockUser: User = {
        id: "usr_001",
        name: "Gopal Chaudhary",
        email: "gopalchaudhary@example.com",
        phone: "+91 9876543210",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        addresses: [
          {
            id: "addr_001",
            label: "Home",
            line1: "House No. 45, Shanti Nagar",
            line2: "Near City Mall",
            city: "Raipur",
            pincode: "492001",
            isDefault: true,
          },
          {
            id: "addr_002",
            label: "Work",
            line1: "Tech Park, Ring Road",
            city: "Bilaspur",
            pincode: "495001",
            isDefault: false,
          },
        ],
        savedRestaurantIds: ["rest_101", "rest_205", "rest_309", "rest_412"],
        joinedAt: "2026-05-22T08:30:00Z",
      };

      try {
        await Promise.all([
          AsyncStorage.setItem("@auth_authenticated", "true"),
          AsyncStorage.setItem("@auth_user", JSON.stringify(mockUser)),
        ]);
        setIsAuthenticated(true);
        setUser(mockUser);
        return true;
      } catch (e) {
        console.error("Failed to login", e);
      }
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string, phone: string): Promise<boolean> => {
    const newUser: User = {
      id: "usr_" + Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone,
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
      addresses: [],
      savedRestaurantIds: [],
      joinedAt: new Date().toISOString(),
    };

    try {
      await Promise.all([
        AsyncStorage.setItem("@auth_authenticated", "true"),
        AsyncStorage.setItem("@auth_user", JSON.stringify(newUser)),
      ]);
      setIsAuthenticated(true);
      setUser(newUser);
      return true;
    } catch (e) {
      console.error("Failed to signup", e);
    }
    return false;
  };

  const logout = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem("@auth_authenticated"),
        AsyncStorage.removeItem("@auth_user"),
      ]);
      setIsAuthenticated(false);
      setUser(null);
    } catch (e) {
      console.error("Failed to logout", e);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem("@auth_onboarding", "true");
      setHasCompletedOnboarding(true);
    } catch (e) {
      console.error("Failed to complete onboarding", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        hasCompletedOnboarding,
        isLoading,
        user,
        login,
        signup,
        logout,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
