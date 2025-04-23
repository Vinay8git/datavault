import { RiLayout2Fill } from "react-icons/ri";
import { IoDocumentSharp } from "react-icons/io5";
import { FaImages } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import { AiFillPieChart } from "react-icons/ai";
import { useState } from "react";

const LeftNav = (props) => {
  const [isDash, setIsDash] = useState(true);
  const [isDocument, setIsDocument] = useState(false);
  const [isImages, setIsImages] = useState(false);
  const [isMedia, setIsMedia] = useState(false);
  const [isOthers, setIsOthers] = useState(false);

  return (
    <div className="leftnav w-75 pt-5 h-136.5 bg-blue-200  flex flex-col gap-4 items-center text-2xl shadow-2xl">
      <button
        onClick={() => {
          setIsDash(true);
          setIsDocument(false);
          setIsImages(false);
          setIsMedia(false);
          setIsOthers(false);
          props.changeTab("dashboard");
        }}
        className={
          isDash
            ? "p-4 w-50 h-10 shadow-lg text-white bg-orange-600 transition-all mb-4 rounded-full hover:cursor-pointer flex items-center justify-center gap-2"
            : "p-4 w-50 h-10  group focus:shadow-lg text-orange-600 transition-all mb-4 rounded-full hover:cursor-pointer flex items-center justify-center gap-2"
        }
      >
        <RiLayout2Fill />
        <p className="drop-shadow-lg">Dashboard</p>
      </button>
      <button
        onClick={() => {
          setIsDash(false);
          setIsDocument(true);
          setIsImages(false);
          setIsMedia(false);
          setIsOthers(false);
          props.changeTab("document");
        }}
        className={
          isDocument
            ? "p-4 w-50 h-10 shadow-lg text-white bg-orange-600 transition-all mb-4 rounded-full hover:cursor-pointer flex items-center justify-center gap-2"
            : "p-4 w-50 h-10  group focus:shadow-lg text-orange-600 transition-all mb-4 rounded-full hover:cursor-pointer flex items-center justify-center gap-2"
        }
      >
        <IoDocumentSharp />
        <p className="drop-shadow-lg">Documents</p>
      </button>
      <button
        onClick={() => {
          setIsDash(false);
          setIsDocument(false);
          setIsImages(true);
          setIsMedia(false);
          setIsOthers(false);
          props.changeTab("image");
        }}
        className={
          isImages
            ? "p-4 w-50 h-10 shadow-lg text-white bg-orange-600 transition-all mb-4 rounded-full hover:cursor-pointer flex items-center justify-center gap-2"
            : "p-4 w-50 h-10  group focus:shadow-lg text-orange-600 transition-all mb-4 rounded-full hover:cursor-pointer flex items-center justify-center gap-2"
        }
      >
        <FaImages />
        <p className="drop-shadow-lg">Images</p>
      </button>
      <button
        onClick={() => {
          setIsDash(false);
          setIsDocument(false);
          setIsImages(false);
          setIsMedia(true);
          setIsOthers(false);
          props.changeTab("media");
        }}
        className={
          isMedia
            ? "p-4 w-50 h-10 shadow-lg text-white bg-orange-600 transition-all mb-4 rounded-full hover:cursor-pointer flex items-center justify-center gap-2"
            : "p-4 w-50 h-10  group focus:shadow-lg text-orange-600 transition-all mb-4 rounded-full hover:cursor-pointer flex items-center justify-center gap-2"
        }
      >
        <FaVideo />
        <p className="drop-shadow-lg">Media</p>
      </button>
      <button
        onClick={() => {
          setIsDash(false);
          setIsDocument(false);
          setIsImages(false);
          setIsMedia(false);
          setIsOthers(true);
          props.changeTab("other");
        }}
        className={
          isOthers
            ? "p-4 w-50 h-10 shadow-lg text-white bg-orange-600 transition-all mb-4 rounded-full hover:cursor-pointer flex items-center justify-center gap-2"
            : "p-4 w-50 h-10  group focus:shadow-lg text-orange-600 transition-all mb-4 rounded-full hover:cursor-pointer flex items-center justify-center gap-2"
        }
      >
        <AiFillPieChart />
        <p className="drop-shadow-lg">Others</p>
      </button>
    </div>
  );
};

export default LeftNav;
