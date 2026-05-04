import { MdCloudUpload } from "react-icons/md";
import { CiLogout, CiSearch } from "react-icons/ci";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginWithMetaMask, logout } from "../services/authService";
import "./NavBar.css";

const NavBar = ({ user, setUser, className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthed = Boolean(user?.address);
  const shortAddress = isAuthed
    ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}`
    : null;

  const gotoProtected = async (path) => {
    if (isAuthed) {
      navigate(path);
      return;
    }

    // send unauthenticated users to gateway with redirect intent
    navigate("/auth-gateway", {
      state: { from: path, source: location.pathname },
    });
  };

  const handleConnect = async () => {
    const res = await loginWithMetaMask(setUser);
    if (!res.success) {
      // keep UI clean for now; auth-gateway provides richer error UX
      console.warn(res.message);
    }
  };

  return (
    <div className={`navbar-wrap ${className}`}>
      <header className="navbar flex items-center justify-between px-4 md:px-5">
        <Link to={isAuthed ? "/dashboard" : "/"} className="brand-logo whitespace-nowrap">
          DataVault<span>X</span>
        </Link>

        <div className="pill-search hidden sm:flex items-center gap-2 px-3">
          <CiSearch className="text-lg text-blue-200/80" />
          <input
            className="w-full text-sm"
            type="text"
            placeholder="Search files, tags, owners..."
            aria-label="Search files"
          />
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {isAuthed ? (
            <button
              onClick={() => gotoProtected("/dashboard")}
              className="wallet-pill px-3 py-2 text-sm"
              title="Open dashboard"
            >
              {shortAddress}
            </button>
          ) : (
            <button
              onClick={handleConnect}
              className="ghost-btn px-4 py-2 text-sm font-semibold"
            >
              Connect Wallet
            </button>
          )}

          <button
            onClick={() => gotoProtected("/upload")}
            className="upload-btn inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold"
          >
            <MdCloudUpload className="text-lg" />
            Upload
          </button>

          <button
            onClick={() => logout(setUser)}
            disabled={!isAuthed}
            aria-disabled={!isAuthed}
            className={`logout-btn p-2 text-2xl ${!isAuthed ? "opacity-50 cursor-not-allowed" : ""}`}
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