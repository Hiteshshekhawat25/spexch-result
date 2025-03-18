import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBalanceData } from "../../Store/Slice/balanceSlice";
import { getBalanceData } from "../../Services/Downlinelistapi";

const BalanceHeader = () => {
  const dispatch = useDispatch();
  const balanceData = useSelector((state) => state.balance);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getBalanceData("user/user-data-summary");
        setData(response?.data?.data);
        if (response?.data?.success) {
          dispatch(setBalanceData(response?.data?.data));
        } else {
          console.error(
            "Failed to fetch balance data: ",
            response.data?.message
          );
        }
      } catch (error) {
        console.error("Failed to fetch balance data:", error.message);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <div className="bg-white shadow-md rounded-md md:p-3 p-2 w-full border border-gray-300">
      {/* Large Screen Grid */}
      <div className="hidden md:grid lg:grid-cols-7 md:grid-cols-6 divide-x divide-gray-200">
        {/* Total Balance */}
        <div className="text-left py-1 text-gray-500 text-sm font-medium pl-2">
          Total Balance
        </div>
        {/* Total Exposure */}
        <div className="text-left py-1 text-gray-500 text-sm font-medium pl-2">
          Total Exposure
        </div>
        {/* Available Balance */}
        <div className="text-left py-1 text-gray-500 text-sm font-medium pl-2">
          Available Balance
        </div>
        {/* Balance */}
        <div className="text-left py-1 text-gray-500 text-sm font-medium pl-2">
          Balance
        </div>
        {/* Total Available Balance */}
        <div className="text-left py-1 text-gray-500 text-sm font-medium pl-2">
          Total Avail. Bal.
        </div>
        {/* Upline P/L */}
        <div className="text-left py-1 text-xs font-medium text-gray-500 pl-2">
          Upline P/L
        </div>
        {/* Empty space */}
        <div className="text-left py-1 text-xs font-medium pl-2"></div>
      </div>
      {/* Large Screen Values */}
      <div className="hidden md:grid lg:grid-cols-7 md:grid-cols-6 divide-x divide-gray-200">
        {/* Total Balance Value */}
        <div className="text-left py-1 text-blue-800 text-md font-bold pl-2 text-[15px]">
          IRP {new Intl.NumberFormat("en-IN").format(data?.totalBalance?.toFixed(2) || 0)}
        </div>
        {/* Total Exposure Value */}
        <div className="text-left py-1 text-blue-800 text-md font-bold pl-2 text-[15px]">
          IRP{" "}
          <span className="text-red-500">
            ({new Intl.NumberFormat("en-IN").format(data?.totalExposure?.toFixed(2) || 0)})
          </span>
        </div>
        {/* Available Balance Value */}
        <div className="text-left py-1 text-blue-800 text-md font-bold pl-2 text-[15px]">
          IRP{" "}
          {new Intl.NumberFormat("en-IN").format(data?.allAvailableBalance?.toFixed(2) || 0)}
        </div>
        {/* Balance Value */}
        <div className="text-left py-1 text-blue-800 text-md font-bold pl-2 text-[15px]">
          IRP {new Intl.NumberFormat("en-IN").format(data?.balance?.toFixed(2) || 0) }
        </div>
        {/* Total Available Balance Value */}
        <div className="text-left py-1 text-blue-800 text-md font-bold pl-2 text-[15px]">
          IRP{" "}
          {new Intl.NumberFormat("en-IN").format(data?.totalAvailableBalance?.toFixed(2) || 0)}
        </div>
        {/* Upline P/L Value */}
        <div className={`text-left py-1 text-blue-800 text-md font-bold pl-2 text-[15px] ${data?.uplineProfitLoss < 0 ? 'text-red-600' : ''}`}>
          IRP {new Intl.NumberFormat("en-IN").format(data?.uplineProfitLoss?.toFixed(2) || 0)}
        </div>
        {/* Empty space */}
        <div className="text-left py-1 text-blue-800 text-md font-bold pl-2 text-[15px]"></div>
      </div>

      {/* Mobile and Tablet Stack */}
      <div className="md:hidden">
        {/* Total Balance */}
        <div className="text-left py-1 text-gray-500 text-sm font-medium pl-1">
          Total Balance
        </div>
        <div className="text-left py-1 text-blue-800 text-md font-bold pl-1 text-[14px]">
          IRP {new Intl.NumberFormat("en-IN").format(data?.totalBalance?.toFixed(2) || 0)}
        </div>
        <div className="w-full border-t border-gray-200"></div>

        {/* Total Exposure */}
        <div className="text-left py-1 text-gray-500 text-sm font-medium pl-1">
          Total Exposure
        </div>
        <div className="text-left py-1 text-blue-800 text-md font-bold pl-1 text-[14px]">
          IRP{" "}
          <span className="text-red-500">
            ({new Intl.NumberFormat("en-IN").format(data?.totalExposure?.toFixed(2) || 0)})
          </span>
        </div>
        <div className="w-full border-t border-gray-200"></div>

        {/* Available Balance */}
        <div className="text-left py-1 text-gray-500 text-sm font-medium pl-1">
          Available Balance
        </div>
        <div className="text-left py-1 text-blue-800 text-md font-bold pl-1 text-[14px]">
          IRP {new Intl.NumberFormat("en-IN").format(data?.allAvailableBalance?.toFixed(2) || 0)}
        </div>
        <div className="w-full border-t border-gray-200"></div>

        {/* Balance */}
        <div className="text-left py-1 text-gray-500 text-sm font-medium pl-1">
          Balance
        </div>
        <div className="text-left py-1 text-blue-800 text-md font-bold pl-1 text-[14px]">
          IRP {new Intl.NumberFormat("en-IN").format(data?.balance?.toFixed(2) || 0)}
        </div>
        <div className="w-full border-t border-gray-200"></div>

        {/* Total Available Balance */}
        <div className="text-left py-1 text-gray-500 text-sm font-medium pl-1">
          Total Avail. Bal
        </div>
        <div className="text-left py-1 text-blue-800 text-md font-bold pl-1 text-[14px]">
          IRP{" "}
          {new Intl.NumberFormat("en-IN").format(data?.totalAvailableBalance?.toFixed(2) || 0)}
        </div>
        <div className="w-full border-t border-gray-200"></div>

        {/* Upline P/L */}
        <div className="text-left py-1 text-xs font-medium text-gray-500 pl-1">
          Upline P/L
        </div>
        <div className={`text-left py-1 text-blue-800 text-md font-bold pl-1 text-[14px] ${data?.uplineProfitLoss < 0 ? 'text-red-500' : ''}`}>
          IRP {new Intl.NumberFormat("en-IN").format(data?.uplineProfitLoss?.toFixed(2) || 0)}
        </div>
        <div className="w-full border-t border-gray-200"></div>
      </div>
    </div>
  );
};

export default BalanceHeader;
