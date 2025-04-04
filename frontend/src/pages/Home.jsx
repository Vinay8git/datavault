import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex justify-center items-center text-3xl h-screen font-semibold bg-amber-200">
      <div className="flex flex-col justify-center items-center gap-3">
        <h1>Welcome to DataVaultX</h1>
        <Link to="/dashboard" className="bg-orange-600 text-white py-2 px-3 rounded-sm">Get Started</Link>
      </div>
    </div>
  );
};

export default HomePage;
