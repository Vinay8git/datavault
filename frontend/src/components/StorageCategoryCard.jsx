import { motion } from "framer-motion";
import { ImageIcon, FolderOpen, Video, ChartPie } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

const iconMap = {
  document: FolderOpen,
  image: ImageIcon,
  media: Video,
  other: ChartPie,
};

const tintMap = {
  document: "from-blue-500/30 to-indigo-500/30 border-blue-300/20",
  image: "from-cyan-500/30 to-sky-500/30 border-cyan-300/20",
  media: "from-violet-500/30 to-fuchsia-500/30 border-violet-300/20",
  other: "from-slate-500/30 to-zinc-500/30 border-slate-300/20",
};

const StorageCategoryCard = ({ type, storage, title, lastUpdate }) => {
  const Icon = iconMap[type] || ChartPie;
  const tint = tintMap[type] || tintMap.other;

  return (
    <motion.article
      className={`rounded-xl border bg-gradient-to-br p-4 shadow-lg shadow-slate-950/20 ${tint}`}
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <motion.div
        className="mb-3 inline-flex rounded-lg border border-white/20 bg-white/10 p-2 text-blue-100"
        whileHover={{ rotate: -4, scale: 1.06 }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
      >
        <Icon className="h-4 w-4" />
      </motion.div>

      <p className="text-lg font-bold text-white">
        <AnimatedCounter value={storage} duration={900} decimals={2} />
      </p>
      <p className="text-sm font-medium text-blue-100/85">{title}</p>
      <p className="mt-2 text-xs text-blue-200/70">Updated {lastUpdate}</p>
    </motion.article>
  );
};

export default StorageCategoryCard;