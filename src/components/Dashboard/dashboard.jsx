import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
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

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Live Sports Profit */}
      <div className="flex-1 mt-4 ml-4 bg-white rounded-lg text-gray-800 shadow-lg border border-gray-300 h-[400px]">
        <h2 className="text-lg bg-gradient-seablue text-white font-bold mb-4 p-2 rounded">
          Live Sports Profit
        </h2>
        <div className="w-64 h-64 mx-auto">
          <Pie data={liveSportsData} />
        </div>
      </div>

      {/* Backup Sports Profit */}
      <div className="flex-1 mt-4 mr-4  bg-white rounded-lg text-gray-800 shadow-lg border border-gray-300 h-[400px] ">
        <h2 className="text-lg bg-gradient-seablue text-white font-bold mb-4 p-2 rounded">
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
