import { RiLayout2Fill } from "react-icons/ri";
import { IoDocumentSharp } from "react-icons/io5";
import { FaImages } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import { AiFillPieChart } from "react-icons/ai";
import "./LeftNav.css";  

const LeftNav = () => {
  return (
    <div className="leftnav w-75 pt-5 h-screen  flex flex-col gap-4 items-center text-2xl shadow-2xl">
      <button className="p-4 w-50 h-10  group focus:shadow-lg text-orange-600 focus-within:text-white transition-all focus:bg-orange-600 mb-4 rounded-full hover:cursor-pointer flex items-center justify-center gap-2">
        <RiLayout2Fill className="text-orange-600 group-focus:text-white" />{" "}
        <p className="drop-shadow-lg">Dashboard</p>
      </button>
      <button className="p-4 w-50 h-10  group focus:shadow-lg text-orange-600 focus:text-white transition-all focus:bg-orange-600 mb-4 rounded-full hover:cursor-pointer flex items-center justify-center gap-2">
        <IoDocumentSharp className="text-orange-600 group-focus:text-white" />
        <p className="drop-shadow-lg">Documents</p>
      </button>
      <button className="p-4 w-50 h-10  group focus:shadow-lg text-orange-600 focus:text-white transition-all focus:bg-orange-600 mb-4 rounded-full hover:cursor-pointer flex items-center justify-center gap-2">
        <FaImages className="text-orange-600 group-focus:text-white" />
        <p className="drop-shadow-lg">Images</p>
      </button>
      <button className="p-4 w-50 h-10  group focus:shadow-lg text-orange-600 focus:text-white transition-all focus:bg-orange-600 mb-4 rounded-full hover:cursor-pointer flex items-center justify-center gap-2">
        <FaVideo className="text-orange-600 group-focus:text-white" />
        <p className="drop-shadow-lg">Media</p>
      </button>
      <button className="p-4 w-50 h-10  group focus:shadow-lg text-orange-600 focus:text-white transition-all focus:bg-orange-600 mb-4 rounded-full hover:cursor-pointer flex items-center justify-center gap-2">
        <AiFillPieChart className="text-orange-600 group-focus:text-white" />
        <p className="drop-shadow-lg">Others</p>
      </button>
    </div>
  );
};

export default LeftNav;