import Card from "../components/UI/Card.jsx";

const OtherPanel = ({ data }) => {
  const others = data.filter((f) => f.type === "other");
  return (
    <div className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {others.map((f, idx) => (
        <Card key={`${f.title}-${idx}`} type={f.type} title={f.title} size={f.size} timeStamp={f.timeStamp} />
      ))}
    </div>
  );
};

export default OtherPanel;