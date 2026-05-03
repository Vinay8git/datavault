import { motion } from "framer-motion";
import { FolderOpen, ImageIcon, Video, FileQuestion } from "lucide-react";
import FileOptions from "./UI/FileOptions";

const typeIcon = {
  document: FolderOpen,
  image: ImageIcon,
  media: Video,
  other: FileQuestion,
};

const FileRow = ({ type = "document", title = "Untitled", timeStamp = "-", size = "-" }) => {
  const Icon = typeIcon[type] || FileQuestion;

  return (
    <motion.div
      className="group flex items-center justify-between rounded-xl border border-slate-300/15 bg-white/5 px-3 py-3"
      whileHover={{ y: -2, borderColor: "rgba(147, 197, 253, 0.35)" }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <motion.div
          className="rounded-lg border border-blue-200/20 bg-blue-500/15 p-2 text-blue-100"
          whileHover={{ scale: 1.06, rotate: -3 }}
          transition={{ type: "spring", stiffness: 280, damping: 16 }}
        >
          <Icon className="h-4 w-4" />
        </motion.div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-100">{title}</p>
          <p className="text-xs text-blue-200/70">
            {timeStamp} · {size}
          </p>
        </div>
      </div>

      <div className="opacity-80 transition group-hover:opacity-100">
        <FileOptions
          onRename={() => {}}
          onDetails={() => {}}
          onShare={() => {}}
          onDownload={() => {}}
          onDelete={() => {}}
        />
      </div>
    </motion.div>
  );
};

export default FileRow;