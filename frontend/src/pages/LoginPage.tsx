import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      const errorMsg =
        !email && !password
          ? "Email et mot de passe sont requis!"
          : !email
          ? "Email requis!"
          : "mot de passe requis!";
      toast.error(errorMsg);
      return;
    }

    try {
      await login(email, password);
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Une erreur s'est produite");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h3 className="font-bold text-lg text-center mb-6 mt-0">Login</h3>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          
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

          <button type="submit" className="btn btn-success w-full">
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
