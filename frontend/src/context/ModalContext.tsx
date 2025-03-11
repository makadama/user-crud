import { createContext, useContext, useState } from "react";

interface ModalContextType {
    isModalOpen: boolean;
    modalMode: "add" | "edit";
    editingUser: any | null;
    openAddModal: () => void;
    openEditModal: (user: any) => void;
    closeModal: () => void;
  }



export const ModalContext = createContext<ModalContextType>({
    isModalOpen: false,
    modalMode: "add",
    openAddModal: () => {},
    editingUser: null,
    openEditModal: () => {},
    closeModal: () => {},
});


export const useModal = () => {
  return useContext(ModalContext);
};

