import { motion } from "framer-motion";
import RecentFiles from "../components/RecentFiles.jsx";
import Overview from "./Overview.jsx";

const container = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const DashboardPanel = ({ data }) => {
  return (
    <motion.section
      className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,1fr)]"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <Overview data={data} />
      </motion.div>

      <motion.div variants={item}>
        <RecentFiles files={data.slice(0, 8)} />
      </motion.div>
    </motion.section>
  );
};

export default DashboardPanel;