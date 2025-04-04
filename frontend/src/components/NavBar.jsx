import { MdCloudUpload } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import UploadTab from "./UI/UploadTab";
import "./NavBar.css";

const NavBar = (props) => {
  

  // if(isUploadTab) {
  //   return <UploadTab/>;
  // }

  return (
    <div className="h-[10vh] flex items-center justify-between navbar ">
      <div className="font-bold text-3xl text-orange-600! w-fit pl-3">
        <Link to="/dashboard">DataVaultX</Link>
      </div>
      <div className="search w-fit flex items-center justify-center border-2 border-orange-500 p-1.5 rounded-full">
        <CiSearch className="text-xl" />
        <input
          className="w-80 h-10 px-2 "
          type="text"
          placeholder="Search Files"
        />
      </div>
      <div className="right flex items-center justify-center w-fit gap-3 mr-7">
        <button
          onClick={() => {
            props.isUpload();
          }}
          className="active:bg-orange-300 transition-all ease-in flex justify-center items-center text-xl hover:cursor-pointer gap-1 mr-3 bg-orange-600 text-white p-2 rounded-full"
        >
          <MdCloudUpload className="w-fit inline-block text-white!" />
          Upload
        </button>
        <Link to="/" className="text-2xl">
          <CiLogout />
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
