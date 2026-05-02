import { MdCloudUpload } from "react-icons/md";
import { CiLogout, CiSearch } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { loginWithMetaMask } from "../services/authService";

import "./NavBar.css";

const BACKEND_URL = "http://localhost:4000";

const NavBar = ({ user, setUser }) => {
  const navigate = useNavigate();

  async function handleLogout() {
    await fetch(`${BACKEND_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    navigate("/");
  }

  const shortAddress = user?.address
    ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}`
    : null;

  return (
    <div className="navbar-wrap">
      <header className="navbar flex items-center justify-between px-4 md:px-5">
        {/* Left: Brand */}
        <Link to="/dashboard" className="brand-logo whitespace-nowrap">
          DataVault<span>X</span>
        </Link>

        {/* Center: Search */}
        <div className="pill-search hidden sm:flex items-center gap-2 px-3">
          <CiSearch className="text-lg text-blue-200/80" />
          <input
            className="w-full text-sm"
            type="text"
            placeholder="Search files, tags, owners..."
            aria-label="Search files"
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {user ? (
            <div className="wallet-pill px-3 py-2 text-sm">{shortAddress}</div>
          ) : (
            <button
              onClick={() => loginWithMetaMask(setUser)}
              className="ghost-btn px-4 py-2 text-sm font-semibold"
            >
              Connect Wallet
            </button>
          )}

          <button
            onClick={() => navigate("/upload")}
            className="upload-btn inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold"
          >
            <MdCloudUpload className="text-lg" />
            Upload
          </button>

          <button
            onClick={handleLogout}
            className="logout-btn p-2 text-2xl"
            aria-label="Logout"
            title="Logout"
          >
            <CiLogout />
          </button>
        </div>
      </header>
    </div>
  );
};

export default NavBar;