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
    <div className="group flex items-center justify-between rounded-xl border border-slate-300/15 bg-white/5 px-3 py-3 transition-all duration-200 hover:border-blue-300/30 hover:bg-white/10">
      <div className="flex min-w-0 items-center gap-3">
        <div className="rounded-lg border border-blue-200/20 bg-blue-500/15 p-2 text-blue-100">
          <Icon className="h-4 w-4" />
        </div>

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
    </div>
  );
};

export default FileRow;