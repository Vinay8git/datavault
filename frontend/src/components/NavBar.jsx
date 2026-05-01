import { MdCloudUpload } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";

import "./NavBar.css";

import { loginWithMetaMask } from "../services/authService";

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

  return (
    <div className="h-[10vh] flex items-center justify-between navbar">

      {/* Logo */}
      <div className="font-bold text-3xl text-orange-600! w-fit pl-3">
        <Link to="/dashboard">DataVaultX</Link>
      </div>

      {/* Search */}
      <div className="search w-fit flex items-center justify-center border-2 border-orange-500 p-1.5 rounded-full">

        <CiSearch className="text-xl" />

        <input
          className="w-80 h-10 px-2"
          type="text"
          placeholder="Search Files"
        />

      </div>

      {/* Right */}
      <div className="right flex items-center justify-center w-fit gap-3 mr-7">

        {/* Wallet */}
        {
          user ? (

            <div className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold">

              {user.address.slice(0, 6)}...
              {user.address.slice(-4)}

            </div>

          ) : (

            <button
              onClick={() => loginWithMetaMask(setUser)}
              className="bg-orange-600 text-white px-4 py-2 rounded-full hover:opacity-80 transition"
            >
              Connect Wallet
            </button>

          )
        }

        {/* Upload */}
        <button
          onClick={() => {
            navigate('/upload');
          }}
          className="active:bg-orange-300 transition-all ease-in flex justify-center items-center text-xl hover:cursor-pointer gap-1 mr-3 bg-orange-600 text-white p-2 rounded-full"
        >

          <MdCloudUpload className="w-fit inline-block text-white!" />
          Upload

        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-2xl hover:text-red-500 transition"
        >
          <CiLogout />
        </button>

      </div>
    </div>
  );
};

export default NavBar;