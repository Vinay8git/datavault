import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import AnimatedCounter from "../AnimatedCounter";

const StorageCard = ({ used }) => {
  const usedStorage = Number.parseFloat(used.split(" ")[0]) || 0;
  const totalStorage = 128;
  const percentage = Math.min(100, Math.round((usedStorage / totalStorage) * 100));
  const unit = used.split(" ")[1] || "GB";

  return (
    <motion.div
      className="rounded-2xl border border-blue-300/20 bg-gradient-to-br from-blue-700/35 to-indigo-900/35 p-4 shadow-xl shadow-slate-950/40"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
    >
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
        <motion.div
          className="h-24 w-24"
          initial={{ scale: 0.92, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.42, ease: "easeOut" }}
        >
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            styles={buildStyles({
              pathColor: "#93c5fd",
              textColor: "#eff6ff",
              trailColor: "rgba(191,219,254,0.24)",
              textSize: "16px",
            })}
          />
        </motion.div>

        <div>
          <h3 className="text-lg font-semibold text-white">Available Storage</h3>
          <p className="mt-1 text-sm text-blue-100/85">
            <AnimatedCounter value={`${usedStorage} ${unit}`} duration={1100} decimals={2} /> used out of {totalStorage}GB
          </p>
          <div className="mt-3 inline-flex rounded-full border border-blue-300/20 bg-white/10 px-3 py-1 text-xs font-medium text-blue-100">
            Enterprise Encrypted Storage
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StorageCard;