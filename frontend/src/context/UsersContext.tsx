import { createContext, useState, useContext, useEffect } from "react";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  password: string;
}

export interface UsersContextType {
  users: User[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  fetchUsersData: (page?: number) => void;
  handleDeleteUser: (id: number) => void;
  handleAddUser: (email: string, password: string, firstName: string, lastName: string, birthDate: string ) => void;
  handleEditUser: (userId: number, updatedUser: Partial<User>) => Promise<void>
}

export const UsersContext = createContext<UsersContextType>({
    users: [],
    loading: false,
    currentPage: 1,
    totalPages: 1,
    fetchUsersData: async () => {},
    handleDeleteUser: async () => {},
    handleAddUser: async () => {},
    handleEditUser: async () => {}
});

export const useUsers = () => {
  return useContext(UsersContext);
};

