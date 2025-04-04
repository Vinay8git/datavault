import { useState } from "react";
import LeftNav from "../components/LeftNav";
import NavBar from "../components/NavBar";
import Center from "../components/UI/Center";

import "./Dashboard.css";
import UploadTab from "../components/UI/UploadTab";
import MultipleFileUploader from "../services/FileUploader";

const Dashboard = () => {
  const [isUploadTab, setIsUploadTab] = useState(false);
  const HandleUploadTab = () => {
    setIsUploadTab(true);
    console.log("working");
  };
  const closeUploadTab = () => {
    setIsUploadTab(false);
  };
  return (
    <div className="dashboard w-full relative">
      <NavBar isUpload={HandleUploadTab} />
      <div className="flex items-center">
        <LeftNav />
        <Center />
        <UploadTab isActive={isUploadTab} closing={closeUploadTab} />
      </div>
      {/* <MultipleFileUploader /> */}
    </div>
  );
};

export default Dashboard;
