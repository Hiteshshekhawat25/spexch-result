import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ClipLoader } from "react-spinners"; 

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false); 
    }, 1000); 
  }, []);

  const liveSportsData = {
    labels: ["Cricket"],
    datasets: [
      {
        label: "Live Sports Profit",
        data: [100],
        backgroundColor: ["#3b82f6"],
        borderColor: ["#ffffff"],
        borderWidth: 2,
      },
    ],
  };

  const backupSportsData = {
    labels: [],
    datasets: [
      {
        label: "Backup Sports Profit",
        data: [0],
        backgroundColor: ["#f3f4f6"],
        borderColor: ["#d1d5db"],
        borderWidth: 2,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative w-48 h-48">
          <div className="absolute w-8 h-8 bg-gradient-green rounded-full animate-crossing1"></div>
          <div className="absolute w-8 h-8 bg-gradient-blue rounded-full animate-crossing2"></div>
          <div className="absolute bottom-[-40px] w-full text-center text-xl font-custom font-semibold text-black">
            <ClipLoader />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Live Sports Profit */}
      <div className="flex-1 mt-4 mx-4 bg-white rounded-lg text-gray-800 shadow-lg border border-gray-300 h-[400px]">
        <h2 className="text-lg bg-gradient-seablue text-white  font-custom font-bold mb-4 p-2 rounded">
          Live Sports Profit
        </h2>
        <div className="w-64 h-64 mx-auto">
          <Pie data={liveSportsData} />
        </div>
      </div>

      {/* Backup Sports Profit */}
      <div className="flex-1 mt-4 mx-4 bg-white rounded-lg text-gray-800 shadow-lg border border-gray-300 h-[400px]">
        <h2 className="text-lg bg-gradient-seablue text-white font-custom font-bold mb-4 p-2 rounded">
          Backup Sports Profit
        </h2>
        <div className="w-64 h-64 mx-auto">
          <Pie data={backupSportsData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

