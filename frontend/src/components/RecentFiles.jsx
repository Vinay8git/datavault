import FileRow from "./File";

const RecentFiles = ({ files = [] }) => {
  return (
    <section className="dv-glass rounded-2xl p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-100 md:text-xl">Recent Files</h2>
        <button className="rounded-full border border-blue-300/30 bg-white/5 px-3 py-1 text-xs font-semibold text-blue-100 transition hover:bg-white/10">
          View All
        </button>
      </div>

      <div className="space-y-2">
        {files.map((file, idx) => (
          <FileRow
            key={`${file.title}-${idx}`}
            type={file.type}
            title={file.title}
            timeStamp={file.timeStamp}
            size={file.size}
          />
        ))}
      </div>
    </section>
  );
};

export default RecentFiles;