import StorageCategoryCard from "../components/StorageCategoryCard.jsx";
import StorageCard from "../components/UI/StorageCard.jsx";
import calculateStorage from "../components/Utility/calculateStorage.jsx";

const Overview = ({ data }) => {
  const result = calculateStorage(data);

  return (
    <section className="dv-glass rounded-2xl p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-100 md:text-xl">Storage Overview</h2>
        <p className="text-xs uppercase tracking-[0.14em] text-blue-200/70">Live Snapshot</p>
      </div>

      <StorageCard used={result.used} />

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <StorageCategoryCard
          type="document"
          storage={result.document}
          title="Documents"
          lastUpdate="10:15am, 10 Oct"
        />
        <StorageCategoryCard
          type="image"
          storage={result.image}
          title="Images"
          lastUpdate="10:45am, 18 Sep"
        />
        <StorageCategoryCard
          type="media"
          storage={result.media}
          title="Media"
          lastUpdate="10:15am, 10 Oct"
        />
        <StorageCategoryCard
          type="other"
          storage={result.other}
          title="Others"
          lastUpdate="10:15am, 10 Oct"
        />
      </div>
    </section>
  );
};

export default Overview;