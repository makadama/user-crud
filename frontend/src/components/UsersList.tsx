import { useEffect } from "react";
import { useUsers } from "../context/UsersContext";
import { useModal } from "../context/ModalContext";
import { useAuth } from "../context/AuthContext";

export default function UsersList() {
  const { users, loading, currentPage, totalPages, fetchUsersData, handleDeleteUser } = useUsers();
  const { openAddModal, openEditModal } = useModal();
  const {authData} = useAuth();

  useEffect(() => {
    fetchUsersData(currentPage);
  }, [currentPage]);

  return (
    <div className="py-5 px-5">
      <h3 className="text-xl font-bold mb-4">Users List</h3>
      <div className="text-end pr-4 mb-2">
        <button className="btn btn-success" onClick={openAddModal}>
          Add User
        </button>
      </div>

      {loading ? (
        <div className="text-center">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">First Name</th>
                <th className="border p-2">Last Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="border p-2">{user.id}</td>
                  <td className="border p-2">{user.firstName}</td>
                  <td className="border p-2">{user.lastName}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2 flex justify-center">
                    <button
                      className="btn btn-sm btn-info mr-2"
                      onClick={() => openEditModal(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={user.id===authData?.id}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center items-center mt-4">
            <button
              className="btn btn-primary mr-2"
              disabled={currentPage === 1}
              onClick={() => fetchUsersData(currentPage - 1)}
            >
              Prev
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-primary ml-2"
              disabled={currentPage >= totalPages}
              onClick={() => fetchUsersData(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
