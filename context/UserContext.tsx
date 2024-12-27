import * as Realm from "realm";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { Config } from "@/config/config";

export const app = new Realm.App({ id: Config.mongoDb.appName });
export const gApp = new Realm.App({id: Config.mongoDb.generalAppName});

interface UserContextType {
  user: Realm.User | null;
  branchId: string | null;  
  emailPasswordLogin: (
    email: string,
    password: string
  ) => Promise<Realm.User | void>;
  logOutUser: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const UserContext = createContext<UserContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Realm.User | null>(null);
  const [branchId, setBranchId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  const emailPasswordLogin = async (
    email: string,
    password: string
  ): Promise<Realm.User | void> => {
    setLoading(true);
    setError(null);
    try {
      const credentials = Realm.Credentials.emailPassword(email, password);
      const loggedInUser = await app.logIn(credentials);
      setUser(loggedInUser);
      await AsyncStorage.setItem("user", JSON.stringify(loggedInUser));

      setLoading(false);
      return loggedInUser;
    } catch (err: any) {
      setError(`Login failed: ${err.message}`);
      setLoading(false);
      throw err;
    }
  };

  const logOutUser = async (): Promise<void> => {
    try {
      await app.currentUser?.logOut();
      setUser(null);
      setBranchId(null);
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("branchId");
      // router.push("/signIn");
    } catch (err: any) {
      setError(`Logout failed: ${err.message}`);
      throw err;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = await AsyncStorage.getItem("user")

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Redirect to the sign-in page logic if needed
      }
    };

    initializeAuth();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        branchId,
        emailPasswordLogin,
        logOutUser,
        loading,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
