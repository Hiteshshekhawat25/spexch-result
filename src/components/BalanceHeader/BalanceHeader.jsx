import { useEffect, useState } from "react";

const BalanceHeader = () => {
  const [balanceData, setBalanceData] = useState({
    totalBalance: "IRP 0",
    totalExposure: "IRP 0",
    availableBalance: "IRP 0",
    balance: "IRP 0",
    uplinePL: "IRP 0",
    totalavailbalance: "IRP 0",
    availableBalanceUpdated: "IRP 0",
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = {
        totalBalance: "IRP 50,000",
        totalExposure: "IRP 10,000",
        availableBalance: "IRP 40,000",
        balance: "IRP 60,000",
        uplinePL: "IRP 5,000",
        totalavailbalance: "IRP 100,000",
        availableBalanceUpdated: "IRP 90,000",
      };
      setBalanceData(data);
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-md p-2 w-full mx-[5px] border border-gray-300">
      <div className="grid grid-cols-7 divide-x divide-gray-200">
        <div className="text-left py-1 text-gray-500 text-xs font-medium pl-2">
          Total Balance
        </div>
        <div className="text-left py-1 text-gray-500 text-xs font-medium pl-2">
          Total Exposure
        </div>
        <div className="text-left py-1 text-gray-500 text-xs font-medium pl-2">
          Available Balance
        </div>
        <div className="text-left py-1 text-gray-500 text-xs font-medium pl-2">
          Balance
        </div>
        <div className="text-left py-1 text-gray-500 text-xs font-medium pl-2">
          Total Avail. Bal
        </div>
        <div className="text-left py-1 text-gray-500 text-xs font-medium pl-2">
          Upline P/L
        </div>
        <div className="text-left py-1 text-gray-500 text-xs font-medium pl-2"></div>
      </div>
      <div className="grid grid-cols-7 divide-x divide-gray-200">
        <div className="text-left py-1 text-blue-800 text-sm font-semibold pl-2">
          {balanceData.totalBalance}
        </div>
        <div className="text-left py-1 text-blue-800 text-sm font-semibold pl-2">
          {balanceData.totalExposure}
        </div>
        <div className="text-left py-1 text-blue-800 text-sm font-semibold pl-2">
          {balanceData.availableBalance}
        </div>
        <div className="text-left py-1 text-blue-800 text-sm font-semibold pl-2">
          {balanceData.balance}
        </div>
        <div className="text-left py-1 text-blue-800 text-sm font-semibold pl-2">
          {balanceData.totalavailbalance}
        </div>
        <div className="text-left py-1 text-blue-800 text-sm font-semibold pl-2">
          {balanceData.uplinePL}
        </div>
        <div className="text-left py-1 text-blue-800 text-sm font-semibold pl-2"></div>
      </div>
    </div>
  );
};

export default BalanceHeader;
