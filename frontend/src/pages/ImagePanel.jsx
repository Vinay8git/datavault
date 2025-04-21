import Card from "../components/UI/Card.jsx"


const ImagePanel = (props) => {
  return (
    <>
      <div className="text-black flex p-9 flex-wrap gap-7">
        {props.data.map((e, id) => {
          if (e.type == "image")
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

export default ImagePanel;
