
import { apiClient } from "./api";
import { User } from "./context/UsersContext";

export const fetchUsers = async (page = 1, pageSize = 5) => {
    return apiClient(`/users?page=${page}&limit=${pageSize}`);
  };
  
export const deleteUser = async (userId: number) => {
return apiClient(`/users/${userId}`, { method: "DELETE", body: JSON.stringify({})});
};

export const updateUser = async (userId: number, updatedUser: Partial<User>) => {
    return apiClient(`/users/${userId}`,{ method: "PUT", body: JSON.stringify(updatedUser)});
};