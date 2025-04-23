import RecentFiles from "../components/RecentFiles.jsx";
import Overview from "./Overview.jsx";

const DashboardPanel = () => {
  return (
    <div className=" w-full h-full flex items-center justify-center gap-10">
      <Overview />
      <RecentFiles />
    </div>
  );
};

export default DashboardPanel;
