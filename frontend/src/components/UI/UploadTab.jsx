import { IoMdClose } from "react-icons/io";
import MultipleFileUploader from "../../services/FileUploader";

const UploadTab = (props) => {
  return (
    <>
      <div className={!props.isActive ? "none hidden" : "flex justify-center items-center w-full h-[100vh] top-0 left-0 bg-gray-900/80 absolute text-4xl font-black "}>
        <div className="w-[60%] h-[80%] flex justify-center items-center flex-col gap-2 relative bg-white rounded-2xl text-lg font-normal text-black">
          <IoMdClose onClick={()=>{props.closing()}} className="text-3xl absolute top-0 right-3 cursor-pointer"/>
          <h2 className="text-2xl font-semibold">Upload File</h2>
          <MultipleFileUploader/>
        </div>
      </div>
    </>
  );
};

export default UploadTab;
