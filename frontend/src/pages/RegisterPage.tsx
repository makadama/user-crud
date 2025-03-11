import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const { register, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleRagistration = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password || !firstName || !lastName || !birthDate) {
      const errorMsg = "Tous les champs sont requis!"
      toast.error(errorMsg);
      return;
    }

    try {
      const formattedBirthDate = new Date(birthDate).toISOString();

      await register( email,
                password,
                firstName,
                lastName,
                formattedBirthDate);

      toast.success("Registration successful!");
                
      if(!token) {
          navigate("/login");
      }
    } catch (error: any) {
      toast.error(error.message || "Une erreur s'est produite");
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h3 className="font-bold text-lg text-center mb-6">Register</h3>

        <form onSubmit={handleRagistration} className="flex flex-col gap-4">
          <label className="input input-bordered flex items-center gap-2 w-full">
            First Name
            <input
              type="text"
              className="grow"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>

          <label className="input input-bordered flex items-center gap-2 w-full">
            Last Name
            <input
              type="text"
              className="grow"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>

          <label className="input input-bordered flex items-center gap-2 w-full">
            Email
            <input
              type="email"
              className="grow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="input input-bordered flex items-center gap-2 w-full">
            Password
            <input
              type="password"
              className="grow"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <label className="input input-bordered flex items-center gap-2 w-full">
            Birthdate
            <input
              type="datetime-local"
              className="grow"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </label>

          <button type="submit" className="btn btn-success w-full">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
