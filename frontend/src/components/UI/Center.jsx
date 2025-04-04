import StorageCategoryCard from "../StorageCategoryCard";
import StorageCard from "./StorageCard";
import RecentFiles from "../RecentFiles";

const Center = () => {
  return (
    <div className=" w-full h-screen flex items-center justify-center gap-10">
      <div className="w-[50%] h-full bg-purple-200 flex flex-col justify-around items-center rounded-4xl px-1">
        <StorageCard />
        <div className="flex gap-3">
          <StorageCategoryCard />
          <StorageCategoryCard />
        </div>
        <div className="flex gap-3">
          <StorageCategoryCard />
          <StorageCategoryCard />
        </div>
      </div>
      <RecentFiles />
    </div>
  );
};

export default Center;