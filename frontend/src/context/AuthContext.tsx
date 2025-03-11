import { createContext, useContext } from "react";

export const AuthContext = createContext<AuthContextType>({
  token: null,
  authData: null,
  login: async () => {},
  logout: () => {},
  register: async () => {}
});

export interface AuthContextType {
  token: string | null;
  authData: authDataType | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register:  (email: string, firstName: string, lastName: string, password: string, birthDate: string ) => Promise<void>;
}

export interface authDataType {
  id: number;
  email: string;
  firstName: string;
}

export const useAuth = () => {
  return useContext(AuthContext);
};


