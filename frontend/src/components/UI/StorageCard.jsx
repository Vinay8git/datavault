import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const StorageCard = () => {
  const percentage = 65;
  const usedStorage = 82;
  const totalStorage = 128;

  return (
    <div className="bg-red-400 text-white rounded-xl p-6 w-80 shadow-lg">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24">
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            styles={buildStyles({
              pathColor: '#fff',
              textColor: '#fff',
              trailColor: '#ff9999',
              textSize: '16px'
            })}
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Available Storage</h2>
          <p className="text-sm">{usedStorage}GB / {totalStorage}GB</p>
        </div>
      </div>
    </div>
  );
};

export default StorageCard;
