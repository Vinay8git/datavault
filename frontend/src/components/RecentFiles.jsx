import { motion } from "framer-motion";
import FileRow from "./File";

const list = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.14 },
  },
};

const row = {
  hidden: { opacity: 0, x: 10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.28, ease: "easeOut" } },
};

const RecentFiles = ({ files = [] }) => {
  return (
    <section className="dv-glass rounded-2xl p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-100 md:text-xl">Recent Files</h2>
        <motion.button
          className="rounded-full border border-blue-300/30 bg-white/5 px-3 py-1 text-xs font-semibold text-blue-100"
          whileHover={{ y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View All
        </motion.button>
      </div>

      <motion.div className="space-y-2" variants={list} initial="hidden" animate="show">
        {files.map((file, idx) => (
          <motion.div key={`${file.title}-${idx}`} variants={row}>
            <FileRow type={file.type} title={file.title} timeStamp={file.timeStamp} size={file.size} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default RecentFiles;