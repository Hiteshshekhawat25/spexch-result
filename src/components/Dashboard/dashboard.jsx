import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ClipLoader } from "react-spinners";
import AnimatedLoader from "../MarketAnalysis/components/Animated";

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
        data: [50],
        backgroundColor: ["#ffffff"],
        borderColor: ["#3b82f6"],
        borderWidth: 2,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
       <AnimatedLoader/>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:gap-6 gap-5 w-full">
      {/* Live Sports Profit */}
      <div className="flex-1 bg-white rounded-lg text-gray-800 shadow-lg border border-gray-300 h-[400px]">
        <h2 className="text-[15px] bg-gradient-seablue text-white  font-custom font-bold py-[6px] px-2 rounded-t">
          Live Sports Profit
        </h2>
        <div className="w-64 h-64 mx-auto p-4">
          <Pie data={liveSportsData} />
        </div>
      </div>

      {/* Backup Sports Profit */}
      <div className="flex-1 bg-white rounded-lg text-gray-800 shadow-lg border border-gray-300 h-[400px]">
        <h2 className="text-[15px] bg-gradient-seablue text-white font-custom font-bold py-[6px] px-2 rounded-t">
          Backup Sports Profit
        </h2>
        <div className="w-64 h-64 mx-auto p-4">
          <Pie data={backupSportsData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
