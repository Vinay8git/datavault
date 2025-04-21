const Center = (props) => {
  return (
    <div className="w-full h-136.5 flex items-center justify-center gap-10 bg-rose-300">
      {props.children}
    </div>
  );
};

export default Center;