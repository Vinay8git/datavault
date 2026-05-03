import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  FileArchive,
  FileVideo,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Plus,
} from "lucide-react";
import SiteFooter from "../components/layout/SiteFooter";

const MAX_FILE_SIZE_MB = 1024; // 1GB example threshold for UX warning

const formatBytes = (bytes = 0) => {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${bytes} B`;
};

const getType = (file) => {
  const t = file.type?.toLowerCase() || "";
  const name = file.name?.toLowerCase() || "";
  if (t.includes("image")) return "image";
  if (t.includes("video")) return "media";
  if (t.includes("pdf") || t.includes("text") || name.endsWith(".doc") || name.endsWith(".docx")) return "document";
  return "other";
};

const getIcon = (type) => {
  if (type === "image") return ImageIcon;
  if (type === "media") return FileVideo;
  if (type === "document") return FileText;
  return FileArchive;
};

const statusTone = {
  queued: "text-amber-200 border-amber-300/30 bg-amber-400/10",
  uploading: "text-blue-100 border-blue-300/30 bg-blue-500/15",
  success: "text-emerald-200 border-emerald-300/30 bg-emerald-500/15",
  failed: "text-rose-200 border-rose-300/30 bg-rose-500/15",
};

const UploadWorkspace = () => {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [hydrating, setHydrating] = useState(true);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const id = setTimeout(() => setHydrating(false), 750);
    return () => clearTimeout(id);
  }, []);

  // Simulated progress loop for premium UX feedback
  useEffect(() => {
    if (!queue.some((f) => f.status === "uploading")) return;

    const timer = setInterval(() => {
      setQueue((prev) =>
        prev.map((f) => {
          if (f.status !== "uploading") return f;
          const next = Math.min(100, f.progress + Math.random() * 18);
          if (next >= 100) {
            return { ...f, progress: 100, status: "success" };
          }
          return { ...f, progress: next };
        })
      );
    }, 420);

    return () => clearInterval(timer);
  }, [queue]);

  const stats = useMemo(() => {
    const total = queue.length;
    const success = queue.filter((f) => f.status === "success").length;
    const uploading = queue.filter((f) => f.status === "uploading").length;
    const failed = queue.filter((f) => f.status === "failed").length;
    const totalBytes = queue.reduce((sum, f) => sum + (f.size || 0), 0);

    return { total, success, uploading, failed, totalBytes };
  }, [queue]);

  const enqueueFiles = (filesLike) => {
    const incoming = Array.from(filesLike || []).map((file, idx) => {
      const type = getType(file);
      const tooLarge = file.size / 1024 / 1024 > MAX_FILE_SIZE_MB;

      return {
        id: `${file.name}-${file.size}-${Date.now()}-${idx}`,
        name: file.name,
        type,
        size: file.size,
        progress: tooLarge ? 0 : 6,
        status: tooLarge ? "failed" : "queued",
        error: tooLarge ? `File exceeds ${MAX_FILE_SIZE_MB}MB threshold.` : null,
      };
    });

    setQueue((prev) => [...incoming, ...prev]);
  };

  const beginUpload = () => {
    setQueue((prev) =>
      prev.map((f) => (f.status === "queued" ? { ...f, status: "uploading", progress: Math.max(8, f.progress) } : f))
    );
  };

  const clearCompleted = () => {
    setQueue((prev) => prev.filter((f) => f.status !== "success"));
  };

  const onDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) enqueueFiles(e.dataTransfer.files);
  };

  return (
    <div className="relative min-h-screen px-4 pb-8 pt-6 md:px-8">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[110px]" />
      <div className="pointer-events-none absolute right-0 top-[25%] h-64 w-64 rounded-full bg-cyan-400/20 blur-[95px]" />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        {/* Left: Dropzone + queue */}
        <section className="dv-glass rounded-[26px] p-4 md:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-xl font-bold text-slate-50 md:text-2xl">Upload Workspace</h1>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/30 bg-white/5 px-3 py-1 text-xs font-semibold text-blue-100">
              Secure Distributed Transfer
            </div>
          </div>

          {/* Dropzone */}
          <motion.div
            className={[
              "upload-zone rounded-2xl border-2 border-dashed p-8 text-center md:p-10",
              dragActive
                ? "border-blue-300/70 bg-blue-400/10"
                : "border-slate-300/25 bg-slate-900/35 hover:border-blue-300/45",
            ].join(" ")}
            onDragEnter={onDrag}
            onDragOver={onDrag}
            onDragLeave={onDrag}
            onDrop={onDrop}
            whileHover={{ y: -1 }}
          >
            <div className="mx-auto mb-4 inline-flex rounded-2xl border border-blue-300/25 bg-blue-500/20 p-3 text-blue-100">
              <UploadCloud className="h-7 w-7" />
            </div>

            <h2 className="text-lg font-semibold text-slate-100">Drag & drop files to begin upload</h2>
            <p className="mt-2 text-sm text-blue-100/75">
              Optimized for encrypted multi-region storage. Supports multiple files in one batch.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => inputRef.current?.click()}
                className="dv-button-primary inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold"
              >
                <Plus className="h-4 w-4" />
                Select Files
              </button>

              <button
                onClick={beginUpload}
                className="rounded-full border border-blue-300/35 bg-white/5 px-4 py-2.5 text-sm font-semibold text-blue-50 transition hover:bg-white/10"
              >
                Start Upload
              </button>
            </div>

            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => enqueueFiles(e.target.files)}
            />
          </motion.div>

          {/* Queue */}
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-blue-200/70">Upload Queue</h3>
              <button
                onClick={clearCompleted}
                className="text-xs font-semibold text-blue-100/80 transition hover:text-blue-50"
              >
                Clear Completed
              </button>
            </div>

            {hydrating ? (
              <div className="space-y-2">
                {[1, 2, 3].map((k) => (
                  <div key={k} className="h-16 animate-pulse rounded-xl border border-white/10 bg-white/5" />
                ))}
              </div>
            ) : queue.length === 0 ? (
              <div className="rounded-xl border border-slate-300/20 bg-slate-900/35 p-4 text-sm text-blue-100/70">
                No files queued yet. Add files to start your distributed upload session.
              </div>
            ) : (
              <div className="space-y-2">
                {queue.map((f) => {
                  const Icon = getIcon(f.type);
                  return (
                    <motion.article
                      key={f.id}
                      className="rounded-xl border border-slate-300/20 bg-slate-900/45 p-3"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="rounded-lg border border-blue-200/20 bg-blue-500/15 p-2 text-blue-100">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-100">{f.name}</p>
                            <p className="text-xs text-blue-200/70">{formatBytes(f.size)}</p>
                          </div>
                        </div>

                        <span
                          className={[
                            "rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em]",
                            statusTone[f.status],
                          ].join(" ")}
                        >
                          {f.status}
                        </span>
                      </div>

                      <div className="mt-2 h-1.5 rounded-full bg-slate-700/60">
                        <motion.div
                          className="h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300"
                          animate={{ width: `${f.progress}%` }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          style={{ width: `${f.progress}%` }}
                        />
                      </div>

                      {f.error ? <p className="mt-2 text-xs text-rose-300">{f.error}</p> : null}
                    </motion.article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Right: session insights */}
        <aside className="dv-glass rounded-[26px] p-4 md:p-5">
          <h2 className="text-lg font-bold text-slate-100">Session Insights</h2>
          <p className="mt-1 text-sm text-blue-100/75">Real-time status for your current upload batch.</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] uppercase tracking-[0.1em] text-blue-200/70">Total Files</p>
              <p className="mt-1 text-xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] uppercase tracking-[0.1em] text-blue-200/70">Uploaded</p>
              <p className="mt-1 text-xl font-bold text-emerald-300">{stats.success}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] uppercase tracking-[0.1em] text-blue-200/70">In Progress</p>
              <p className="mt-1 text-xl font-bold text-blue-200">{stats.uploading}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] uppercase tracking-[0.1em] text-blue-200/70">Failed</p>
              <p className="mt-1 text-xl font-bold text-rose-300">{stats.failed}</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-blue-300/20 bg-blue-500/10 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-blue-200/70">Total Batch Size</p>
            <p className="mt-1 text-lg font-bold text-white">{formatBytes(stats.totalBytes)}</p>
          </div>

          <div className="mt-4 space-y-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-blue-100/85">
              <div className="mb-1 flex items-center gap-2 font-semibold text-slate-100">
                <Clock3 className="h-4 w-4 text-blue-200" />
                Queue Processing
              </div>
              Uploads are streamed in secure batches with retry-safe session handling.
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-blue-100/85">
              <div className="mb-1 flex items-center gap-2 font-semibold text-slate-100">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                Integrity Assurance
              </div>
              Each object is verified before being marked as persisted.
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-blue-100/85">
              <div className="mb-1 flex items-center gap-2 font-semibold text-slate-100">
                <AlertTriangle className="h-4 w-4 text-amber-300" />
                Large File Guidance
              </div>
              Files beyond threshold are flagged for chunked transfer policies.
            </div>
          </div>
        </aside>
      </div>
      <SiteFooter />
    </div>
  );
};

export default UploadWorkspace;