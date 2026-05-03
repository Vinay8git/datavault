import { ImageIcon, FolderOpen, Video, ChartPie } from "lucide-react";

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
    <article
      className={`rounded-xl border bg-gradient-to-br p-4 shadow-lg shadow-slate-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl ${tint}`}
    >
      <div className="mb-3 inline-flex rounded-lg border border-white/20 bg-white/10 p-2 text-blue-100">
        <Icon className="h-4 w-4" />
      </div>

      <p className="text-lg font-bold text-white">{storage}</p>
      <p className="text-sm font-medium text-blue-100/85">{title}</p>
      <p className="mt-2 text-xs text-blue-200/70">Updated {lastUpdate}</p>
    </article>
  );
};

export default StorageCategoryCard;