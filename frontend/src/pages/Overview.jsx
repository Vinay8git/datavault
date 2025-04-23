import StorageCategoryCard from "../components/StorageCategoryCard.jsx";
import StorageCard from "../components/UI/StorageCard.jsx";

const Overview = () => {
  return (
    <div className="w-[40%] h-[100%] bg-purple-200 flex flex-col justify-around items-center rounded-2xl px-1">
      <StorageCard />
      <div className="flex gap-6 items-center justify-center flex-wrap">
        <StorageCategoryCard type="document" storage="20 GB" title="Document" lastUpdate="10:15am, 10 Oct" />
        <StorageCategoryCard type="image" storage="10 GB" title="Images" lastUpdate="10:45am, 18 Sep"  />
        <StorageCategoryCard type="media" storage="30 GB" title="Videos" lastUpdate="10:15am, 10 Oct"  />
        <StorageCategoryCard type="other" storage="40 GB" title="Others" lastUpdate="10:15am, 10 Oct"  />
      </div>
    </div>
  );
};

export default Overview;
