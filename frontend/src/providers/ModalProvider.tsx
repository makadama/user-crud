import { useState } from "react";
import { ModalContext } from "../context/ModalContext";

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [editingUser, setEditingUser] = useState(null);
  
    const openAddModal = () => {
      setModalMode("add");
      setModalOpen(true);
    };
  
    const openEditModal = (user: any) => {
      setEditingUser(user);
      setModalMode("edit");
      setModalOpen(true);
    };
  
    const closeModal = () => {
      setEditingUser(null);
      setModalOpen(false);
    };
  
    return (
      <ModalContext.Provider value={{ isModalOpen, modalMode, editingUser, openAddModal, openEditModal, closeModal }}>
        {children}
      </ModalContext.Provider>
    );
  };