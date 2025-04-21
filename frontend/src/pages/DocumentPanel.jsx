import Card from "../components/UI/Card.jsx";

const DocumentPanel = (props) => {
  return (
    <>
      <div className="text-black flex p-9 flex-wrap gap-7">
        {props.data.map((e, id) => {
          if (e.type == "document")
            return (
              <Card
                key={id}
                type={e.type}
                title={e.title}
                size={e.size}
                timeStamp={e.timeStamp}
              />
            );
        })}
      </div>
    </>
  );
};

export default DocumentPanel;
