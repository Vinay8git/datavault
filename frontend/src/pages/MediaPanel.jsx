import Card from "../components/UI/Card.jsx";

const MediaPanel = ({ data }) => {
  const media = data.filter((f) => f.type === "media");
  return (
    <div className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {media.map((f, idx) => (
        <Card key={`${f.title}-${idx}`} type={f.type} title={f.title} size={f.size} timeStamp={f.timeStamp} />
      ))}
    </div>
  );
};

export default MediaPanel;