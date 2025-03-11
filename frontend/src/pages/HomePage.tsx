import UsersList from "../components/UsersList";
import ModalForm from "../components/ModalForm";
import { useModal } from "../context/ModalContext";

const HomePage = () => {
  const { isModalOpen } = useModal();

  return (
    <>
      <UsersList />
      {isModalOpen && <ModalForm />}
    </>
  );
};

export default HomePage;
