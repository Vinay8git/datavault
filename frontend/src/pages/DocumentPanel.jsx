import Card from "../components/UI/Card.jsx";

const DocumentPanel = ({ data }) => {
  const docs = data.filter((f) => f.type === "document");
  return (
    <div className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {docs.map((f, idx) => (
        <Card key={`${f.title}-${idx}`} type={f.type} title={f.title} size={f.size} timeStamp={f.timeStamp} />
      ))}
    </div>
  );
};

export default DocumentPanel;