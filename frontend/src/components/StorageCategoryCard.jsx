import { ImageIcon, FolderOpen, Video, ChartPie } from 'lucide-react';

const StorageCategoryCard = (props) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-3 w-45 flex flex-col items-center h-35">
      <div className="relative -top-8">
        <div className="bg-blue-400 rounded-full p-3 flex items-center justify-center shadow-md">
          {props.type == "document" ? <FolderOpen className="text-white w-6 h-6" /> : ""}
          {props.type == "image" ? <ImageIcon className="text-white w-6 h-6" /> : ""}
          {props.type == "media" ? <Video className="text-white w-6 h-6" /> : ""}
          {props.type == "other" ? <ChartPie className="text-white w-6 h-6" /> : ""}
        </div>
      </div>
      <div className="-mt-8 text-center">
        <p className="text-lg font-semibold">{props.storage}</p>
        <p className="text-gray-700 font-medium">{props.title}</p>
        <p className="text-gray-400 text-sm mt-1">Last update</p>
        <p className="text-gray-500 text-sm">{props.lastUpdate}</p>
      </div>
    </div>
  );    
};

export default StorageCategoryCard;
