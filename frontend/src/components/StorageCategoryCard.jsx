import { ImageIcon, FolderOpen } from 'lucide-react';

const StorageCategoryCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 w-60 flex flex-col items-center">
      <div className="relative -top-8">
        <div className="bg-blue-400 rounded-full p-4 flex items-center justify-center shadow-md">
          <FolderOpen className="text-white w-8 h-8" />
        </div>
      </div>
      <div className="-mt-4 text-center">
        <p className="text-lg font-semibold">20 GB</p>
        <p className="text-gray-700 font-medium">Images</p>
        <p className="text-gray-400 text-sm mt-2">Last update</p>
        <p className="text-gray-500 text-sm">10:15am, 10 Oct</p>
      </div>
    </div>
  );    
};

export default StorageCategoryCard;
