import { useState } from "react";
import { fetchUsers, deleteUser, updateUser } from "../utils";
import { UsersContext, User } from "../context/UsersContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";


export const UsersProvider = ({ children }: { children: React.ReactNode }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const {register} = useAuth();
  
    const fetchUsersData = async (page = 1) => {
      setLoading(true);
      try {
        const data = await fetchUsers(page, 5);
        setUsers(data.users);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(page);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
  

    const handleDeleteUser = async (id: number) => {
      try {
        await deleteUser(id);
        toast.success("User successfully deleted")
        fetchUsersData(1);
      } catch (error) {
        console.error("Failed to delete user:", error);
      } 
    };
  

    const handleAddUser = async (email: string, password: string, firstName: string, lastName: string, birthDate: string ) => {
      try {
        const formattedBirthDate = new Date(birthDate).toISOString();

        await register( email,
                    password,
                    firstName,
                    lastName,
                    formattedBirthDate);
        fetchUsersData(1);
      } catch (error) {
        console.error("Failed to add user:", error);
      }
    };

    const handleEditUser = async (userId: number, updatedUser: Partial<User>) => {
      try {
        const updated = await updateUser(userId, updatedUser);
        fetchUsersData(1);
        toast.success("User updated successfully!");
      } catch (error: any) {
        console.error("Error updating user:", error);
        toast.error(error.message || "An error occurred while updating user");
      }
    };
  
    return (
      <UsersContext.Provider
        value={{ users, loading, currentPage, totalPages, fetchUsersData, handleDeleteUser, handleAddUser, handleEditUser }}
      >
        {children}
      </UsersContext.Provider>
    );
  };