import { useAuth } from "../context/AuthContext";
export default function Navbar() {
  const {token, logout} = useAuth();
    return (
      <>
        <div className="navbar bg-base-100 fixed top-0 left-0 w-full z-50 shadow-md">
          <div className="navbar-start">
            <a className="btn btn-ghost text-xl no-underline hover:no-underline">
              Users Management App
            </a>
          </div>
  
          <div className="navbar-end pr-4">
            {token && <button onClick={logout} className="btn btn-warning">
              Disconnect
            </button> }
          </div>
        </div>
  
        <div className="h-16"></div>
      </>
    );
  }
  