import { ImageIcon, FolderOpen, Video, ChartPie } from "lucide-react";
import { SlOptionsVertical } from "react-icons/sl";
import { SiGoogledocs } from "react-icons/si";
import { PiDotsThreeOutlineVerticalLight } from "react-icons/pi";
import { IoImages } from "react-icons/io5";
import { RiFileVideoFill } from "react-icons/ri";
import { FaFileCircleQuestion } from "react-icons/fa6";

const Card = (props) => {
  let logo;
  if (props.type == 'document') {
    logo = <SiGoogledocs className="text-blue-600 w-9 h-9" />
  }
  else if (props.type == 'image'){
    logo = <IoImages className="text-emerald-600 w-9 h-9" />
  }
  else if(props.type == 'media'){
    logo = <RiFileVideoFill className="text-rose-600 w-9 h-9" />
  }
  else{
    logo = <FaFileCircleQuestion className="text-sky-700 w-9 h-9" />
  }
  // const logo = <SiGoogledocs className="text-blue-600 w-9 h-9" />

  return (
    <>
      <div className="w-55 h-45 bg-white rounded-lg flex flex-col p-2 shadow-2xl">
        <div className="flex items-center justify-between mx-4 h-[60%]">
          <div className="bg-gray-50 shadow-lg w-fit h-fit rounded-full p-4 flex items-center justify-center shadow-blue-400 ">
            {logo}
          </div>
          <div className="flex flex-col items-end w-fit justify-center gap-5 h-full ">
            <div className="text-3xl items-right w-fit cursor-pointer">
              <PiDotsThreeOutlineVerticalLight/>
            </div>
            <h2 className="font-semibold">{props.size}</h2>
          </div>
        </div>
        <div className="pl-5">
          <h3 className="font-semibold">{props.title}</h3>
          <p className="text-gray-700">{props.timeStamp}</p>
        </div>
      </div>
    </>
  );
};

export default Card;
