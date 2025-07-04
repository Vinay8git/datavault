import RecentFiles from "../components/RecentFiles.jsx";
import Overview from "./Overview.jsx";

const DashboardPanel = (props) => {
  return (
    <div className=" w-full h-full flex items-center justify-center gap-10">
      <Overview  data={props.data} />
      <RecentFiles />
    </div>
  );
};

export default DashboardPanel;
