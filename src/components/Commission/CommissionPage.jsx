import React, { useState } from "react";

const CommissionPage = () => {
  const [activeTab, setActiveTab] = useState("Fancy");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const tabs = ["Fancy", "Matka", "Casino", "Binary", "Sportbook", "Bookmaker"];
  const agents = [
    { name: "yeshvi19", turnover: 0, commission: 0 },
    { name: "krishagent", turnover: 0, commission: 0 },
  ];

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="bg-gray-200 p-4 rounded-md shadow-md flex flex-wrap items-center gap-4">
        <input
          type="date"
          className="p-2 border text-black rounded-md"
          placeholder="dd/mm/yyyyy"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <span>TO</span>
        <input
          type="date"
           placeholder="dd/mm/yyyyy"
          className="p-2 border text-black rounded-md"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button className="bg-blue-600 text-white bg-gray-500 px-4 py-2 rounded-md">
          Get Commission
        </button>
      </div>

      <div className="bg-gray-800 text-white p-4 mt-4 rounded-md text-lg font-bold">
        Agent Commission
      </div>

      <div className="bg-white p-4 rounded-md shadow-md mt-4">
        <div className="flex flex-wrap border-b">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`p-2 px-4 ${
                activeTab === tab ? "border-b-2 border-black" : "text-gray-500"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Agent Name</th>
                <th className="p-2 border">Turn Over</th>
                <th className="p-2 border">Commission</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            {/* <tbody>
              {agents.map((agent, index) => (
                <tr key={index} className="text-center border">
                  <td className="p-2 border">{agent.name}</td>
                  <td className="p-2 border">{agent.turnover}</td>
                  <td className="p-2 border">{agent.commission}</td>
                  <td className="p-2 border">
                    <button className="bg-gradient-blue text-white px-3 py-1 rounded mr-2">
                      Settle
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded">
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody> */}
          </table>
        </div>
      </div>
    </div>
  );
};

export default CommissionPage;
