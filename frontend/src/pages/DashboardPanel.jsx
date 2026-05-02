import RecentFiles from "../components/RecentFiles.jsx";
import Overview from "./Overview.jsx";

const DashboardPanel = ({ data }) => {
  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,1fr)]">
      <Overview data={data} />
      <RecentFiles files={data.slice(0, 8)} />
    </section>
  );
};

export default DashboardPanel;