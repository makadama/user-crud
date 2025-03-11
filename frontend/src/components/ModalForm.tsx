import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useModal } from "../context/ModalContext";
import { useUsers } from "../context/UsersContext";

const ModalForm = () => {
  const { isModalOpen, closeModal, modalMode, editingUser } = useModal();
  const { handleAddUser, handleEditUser } = useUsers();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");

  useEffect(() => {
    if (modalMode === "edit" && editingUser) {
      setFirstName(editingUser.firstName || "");
      setLastName(editingUser.lastName || "");
      setEmail(editingUser.email || "");
      setBirthDate(editingUser.birthDate ? editingUser.birthDate.split("T")[0] : "");
    } else {
      resetForm();
    }
  }, [modalMode, editingUser]);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setBirthDate("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!firstName || !lastName || !birthDate || (modalMode === "add" && (!email || !password))) {
      toast.error("All fields are required!");
      return;
    }

    try {
      if (modalMode === "add") {
        await handleAddUser(email, password, firstName, lastName, birthDate);
        toast.success("User added successfully!");
      } else if (modalMode === "edit") {
        await handleEditUser(editingUser.id, { firstName, lastName, birthDate: new Date(birthDate).toISOString() });
        toast.success("User updated successfully!");
      }
      closeModal(); 
      resetForm(); 
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  if (!isModalOpen) return null;

  return (
    <dialog id="user_modal" className="modal bg-black/40" open={isModalOpen}>
      <div className="modal-box">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>
          ✕
        </button>
        <h3 className="font-bold text-lg py-4">{modalMode === "edit" ? "Edit User" : "Add User"}</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="input input-bordered flex items-center gap-2 w-full">
            First Name
            <input type="text" className="grow" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </label>

          <label className="input input-bordered flex items-center gap-2 w-full">
            Last Name
            <input type="text" className="grow" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </label>

          {modalMode === "add" && (
            <>
              <label className="input input-bordered flex items-center gap-2 w-full">
                Email
                <input type="email" className="grow" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>

              <label className="input input-bordered flex items-center gap-2 w-full">
                Password
                <input type="password" className="grow" value={password} onChange={(e) => setPassword(e.target.value)} />
              </label>
            </>
          )}

          <label className="input input-bordered flex items-center gap-2 w-full">
            Birthdate
            <input type="datetime-local" className="grow" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
          </label>

          <button type="submit" className="btn btn-success w-full">
            {modalMode === "edit" ? "Save Changes" : "Register"}
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default ModalForm;
