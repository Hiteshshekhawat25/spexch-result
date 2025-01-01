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
    <div className="flex justify-around p-6 gap-x-6 mx-4 border border-gray-400 mt-4">
      {/* Live Sports Profit */}
      <div className="w-1/2 p-6 bg-white rounded-lg text-gray-800 shadow-lg">
        <h2 className="text-lg bg-gray-800 text-white font-bold mb-4 p-2 rounded">
          Live Sports Profit
        </h2>
        <div className="w-64 h-64 mx-auto">
          <Pie data={liveSportsData} />
        </div>
      </div>

      {/* Backup Sports Profit */}
      <div className="w-1/2 p-6 bg-white rounded-lg text-gray-800 shadow-lg">
        <h2 className="text-lg bg-gray-800 text-white font-bold mb-4 p-2 rounded">
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
