import { useState } from "react";
import LeftNav from "../components/LeftNav";
import NavBar from "../components/NavBar";
import Center from "../components/UI/Center";
import DashboardPanel from "./DashboardPanel";
import DocumentPanel from "./DocumentPanel.jsx";
import ImagePanel from "./ImagePanel.jsx";
import MediaPanel from "./MediaPanel.jsx";
import OtherPanel from "./OtherPanel.jsx";
import calculateStorage from "../components/Utility/calculateStorage.jsx";

import UploadTab from "../components/UI/UploadTab";

const Dashboard = () => {
  const data = [
    {
      title: "Resume.pdf",
      type: "document",
      size: "120 KB",
      timeStamp: "10:09pm, 12 Apr",
    },
    {
      title: "TeamPhoto.jpg",
      type: "image",
      size: "3.4 MB",
      timeStamp: "11:15am, 11 Apr",
    },
    {
      title: "IntroVideo.mp4",
      type: "media",
      size: "700 MB",
      timeStamp: "9:42am, 10 Apr",
    },
    {
      title: "ProjectDocs.zip",
      type: "other",
      size: "20 MB",
      timeStamp: "7:00pm, 9 Apr",
    },
    {
      title: "MeetingNotes.docx",
      type: "document",
      size: "1.2 MB",
      timeStamp: "2:22pm, 8 Apr",
    },
    {
      title: "UI_Screenshot.png",
      type: "image",
      size: "2.1 MB",
      timeStamp: "5:55pm, 7 Apr",
    },
    {
      title: "Lecture.mp3",
      type: "media",
      size: "4 MB",
      timeStamp: "12:00pm, 6 Apr",
    },
    {
      title: "DataExport.csv",
      type: "document",
      size: "600 KB",
      timeStamp: "8:45am, 5 Apr",
    },
    {
      title: "Thumbnail.jpeg",
      type: "image",
      size: "1.5 MB",
      timeStamp: "10:10pm, 4 Apr",
    },
    {
      title: "FinalPresentation.pptx",
      type: "document",
      size: "5 MB",
      timeStamp: "3:33pm, 3 Apr",
    },
    {
      title: "Recording.mov",
      type: "media",
      size: "1.2 GB",
      timeStamp: "6:45am, 2 Apr",
    },
    {
      title: "LogoDesign.ai",
      type: "image",
      size: "6.5 MB",
      timeStamp: "9:09pm, 1 Apr",
    },
    {
      title: "Backup.db",
      type: "other",
      size: "25 MB",
      timeStamp: "11:11am, 31 Mar",
    },
    {
      title: "Notes.txt",
      type: "document",
      size: "24 KB",
      timeStamp: "8:08am, 30 Mar",
    },
    {
      title: "PromoClip.mp4",
      type: "media",
      size: "800 MB",
      timeStamp: "7:30pm, 29 Mar",
    },
    {
      title: "IDCard.jpg",
      type: "image",
      size: "1.1 MB",
      timeStamp: "4:44pm, 28 Mar",
    },
    {
      title: "ConfigFile.json",
      type: "other",
      size: "18 KB",
      timeStamp: "10:10am, 27 Mar",
    },
    {
      title: "Syllabus.pdf",
      type: "document",
      size: "980 KB",
      timeStamp: "6:00pm, 26 Mar",
    },
    {
      title: "Screenshot2.png",
      type: "image",
      size: "2.4 MB",
      timeStamp: "1:15am, 25 Mar",
    },
    {
      title: "Tutorial.mp3",
      type: "media",
      size: "6 MB",
      timeStamp: "9:30am, 24 Mar",
    },
  ];

  const result = calculateStorage(data);
  console.log(result.used);

  const [isUploadTab, setIsUploadTab] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const HandleUploadTab = () => {
    setIsUploadTab(true);
  };

  const closeUploadTab = () => {
    setIsUploadTab(false);
  };

  const HandleActiveTab = (tab) => {
    return setActiveTab(tab);
  };

  return (
    <div className="dashboard w-full relative">
      <NavBar isUpload={HandleUploadTab} />
      <div className="flex">
        <LeftNav changeTab={HandleActiveTab} />
        <Center>
          {activeTab == "dashboard" ? <DashboardPanel data={data} /> : ""}
          {activeTab == "document" ? <DocumentPanel data={data} /> : ""}
          {activeTab == "image" ? <ImagePanel data={data} /> : ""}
          {activeTab == "media" ? <MediaPanel data={data} /> : ""}
          {activeTab == "other" ? <OtherPanel data={data} /> : ""}
        </Center>
        <UploadTab isActive={isUploadTab} closing={closeUploadTab} />
      </div>
    </div>
  );
};

export default Dashboard;

