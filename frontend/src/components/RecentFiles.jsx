import File from "./File";

const RecentFiles = () => {
  return (
    <div className="w-[40%] h-full bg-purple-200 rounded-4xl flex flex-col items-center justify-start gap-3 pt-2">
      <h1 className="text-2xl font-bold text-black ml-6">Recent Files Uploaded</h1>
      <File />
      <File />
      <File />
      <File />
    </div>
  );
};

export default RecentFiles;
