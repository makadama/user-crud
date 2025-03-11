import { jwtDecode } from "jwt-decode";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import {
  AuthContext,
  AuthContextType,
  authDataType,
} from "../context/AuthContext";
import { apiClient } from "../api";

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("auth_token")
  );
  const [authData, setAuthData] = useState<authDataType | null>(() => {
    const storedData = localStorage.getItem("auth_data");
    return storedData ? JSON.parse(storedData) : null;
  });

  const logout = (): void => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_data");
    localStorage.removeItem("currentStore");
    setToken(null);
    setAuthData(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    if (token) {
      try {
        const { exp } = jwtDecode<{ exp: number }>(token);
        const timeLeft = exp * 1000 - Date.now();

        if (timeLeft <= 0) {
          logout();
        } else {
          const timeout = setTimeout(() => {
            logout();
          }, timeLeft);

          return () => clearTimeout(timeout);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        logout();
      }
    }
  }, [token]);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const res = await apiClient(`/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (res.accessToken) {
        const { exp } = jwtDecode<{ exp: number }>(res.accessToken);
        if (Date.now() >= exp * 1000) {
          throw new Error(
            "Received expired token. Please try logging in again."
          );
        }

        setToken(res.accessToken);
        setAuthData({ id: res.id, firstName: res.firstName, email: res.email });
        localStorage.setItem("auth_token", res.accessToken);
        localStorage.setItem(
          "auth_data",
          JSON.stringify({ id: res.id, firstName: res.firstName, email: res.email })
        );
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      throw new Error(
        error.message || "An unknown error occurred during login."
      );
    }
  };

  const register = async(email: string, password: string, firstName: string, lastName: string, birthDate: string) => {
    try {
        const res = await apiClient(`/users/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
                firstName,
                lastName,
                birthDate,
            }),
          })
    }
    catch(error: any){
        console.error("Registration failed:", error);
      throw new Error(
        error.message || "An unknown error occurred during Registration."
      );
    }
    }

  const contextValue: AuthContextType = {
    token,
    authData,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
