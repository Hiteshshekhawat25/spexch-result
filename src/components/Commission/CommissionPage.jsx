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
    <div className="md:mx-0 mx-2">
      <div className="bg-[#e0e6e6] md:p-4 p-3 border-black border border-b-gray-400 rounded-md flex-wrap items-center sm:gap-4 gap-3 grid lg:grid-cols-7 md:grid-cols-5">
        <input
          type="date"
          className="p-1 border border-gray-400 h-[35px] rounded-[4px] text-[13px] outline-none"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <span className="text-[13px] w-full block sm:text-center ">TO</span>
        <input
          type="date"
          className="p-1 border border-gray-400 h-[35px] rounded-[4px] text-[13px] outline-none"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <div className="flex max-sm:justify-center">
          <button className="bg-blue-600 text-white bg-gradient-seablue font-semibold text-[14px] px-2 py-1.5 rounded-md">
            Get Commission
          </button>
        </div>
      </div>

      <div className="border border-gray-300 rounded-[5px] overflow-hidden bg-white mt-5">
        <h1 className="bg-gradient-seablue text-white font-custom font-semibold text-[14px] p-2">
          Agent Commission
        </h1>
        <div className="bg-white md:p-4 p-3.5 rounded-md shadow-md">
          <div className="flex flex-wrap bg-gray-300/70">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`p-2 px-4 text-[13px] border border-t-2 border-b-0 rounded-t-[5px] font-bold ${
                  activeTab === tab ? "bg-white border-t-black border-gray-300" : "text-gray-500"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="border border-gray-300 border-t-0 md:p-4 p-2 pt-5">
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 bodet">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">Agent Name</th>
                    <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">Turn Over</th>
                    <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">Commission</th>
                    <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">Action</th>
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
      </div>

    </div>
  );
};

export default CommissionPage;
