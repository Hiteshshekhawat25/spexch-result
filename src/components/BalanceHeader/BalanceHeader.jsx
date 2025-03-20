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
    <div className="bg-white shadow-md rounded lg:p-2 w-full border border-gray-300 max-md:border-b-gray-600 max-md:border-b-1">
      {/* Large Screen Grid */}
      <div className="hidden lg:grid lg:grid-cols-7 md:grid-cols-6 divide-x divide-gray-200">
        {/* Total Balance */}
        <div className="text-left py-1 text-[#9B9B99] text-xs font-bold pl-2">
          Total Balance
        </div>
        {/* Total Exposure */}
        <div className="text-left py-1 text-[#9B9B99] text-xs font-bold pl-2">
          Total Exposure
        </div>
        {/* Available Balance */}
        <div className="text-left py-1 text-[#9B9B99] text-xs font-bold pl-2">
          Available Balance
        </div>
        {/* Balance */}
        <div className="text-left py-1 text-[#9B9B99] text-xs font-bold pl-2">
          Balance
        </div>
        {/* Total Available Balance */}
        <div className="text-left py-1 text-[#9B9B99] text-xs font-bold pl-2">
          Total Avail. Bal.
        </div>
        {/* Upline P/L */}
        <div className="text-left py-1 text-[#9B9B99] text-xs font-bold pl-2">
          Upline P/L
        </div>
        {/* Empty space */}
        <div className="text-left py-1 text-xs font-medium pl-2"></div>
      </div>
      {/* Large Screen Values */}
      <div className="hidden lg:grid lg:grid-cols-7 md:grid-cols-6 divide-x divide-gray-200">
        {/* Total Balance Value */}
        <div className="text-left py-1 text-[#243a48] text-md font-bold pl-2 text-[15px]">
          IRP {new Intl.NumberFormat("en-IN").format(data?.totalBalance?.toFixed(2) || 0)}
        </div>
        {/* Total Exposure Value */}
        <div className="text-left py-1 text-[#243a48] text-md font-bold pl-2 text-[15px]">
          IRP{" "}
          <span className="text-red-500">
            ({new Intl.NumberFormat("en-IN").format(data?.totalExposure?.toFixed(2) || 0)})
          </span>
        </div>
        {/* Available Balance Value */}
        <div className="text-left py-1 text-[#243a48] text-md font-bold pl-2 text-[15px]">
          IRP{" "}
          {new Intl.NumberFormat("en-IN").format(data?.allAvailableBalance?.toFixed(2) || 0)}
        </div>
        {/* Balance Value */}
        <div className="text-left py-1 text-[#243a48] text-md font-bold pl-2 text-[15px]">
          IRP {new Intl.NumberFormat("en-IN").format(data?.balance?.toFixed(2) || 0) }
        </div>
        {/* Total Available Balance Value */}
        <div className="text-left py-1 text-[#243a48] text-md font-bold pl-2 text-[15px]">
          IRP{" "}
          {new Intl.NumberFormat("en-IN").format(data?.totalAvailableBalance?.toFixed(2) || 0)}
        </div>
        {/* Upline P/L Value */}
        <div className={`text-left py-1 text-[#243a48] text-md font-bold pl-2 text-[15px] ${data?.uplineProfitLoss < 0 ? 'text-red-600' : ''}`}>
          IRP {new Intl.NumberFormat("en-IN").format(data?.uplineProfitLoss?.toFixed(2) || 0)}
        </div>
        {/* Empty space */}
        <div className="text-left py-1 text-blue-800 text-md font-bold pl-2 text-[15px]"></div>
      </div>

      {/* Mobile and Tablet Stack */}
      <div className="lg:hidden">
        <div className="border-b border-gray-200 px-[20px] py-[7px]">
          {/* Total Balance */}
          <div className="text-left text-[#9B9B99] text-xs font-bold">
            Total Balance
          </div>
          <div className="text-left mt-1.5 text-[#243a48] font-bold text-[15px]">
            IRP {new Intl.NumberFormat("en-IN").format(data?.totalBalance?.toFixed(2) || 0)}
          </div>
        </div>

        <div className="border-b border-gray-200 px-[20px] py-[7px]">
          {/* Total Exposure */}
          <div className="text-left mt-1.5 text-[#9B9B99] text-xs font-bold">
            Total Exposure
          </div>
          <div className="text-left mt-1.5 text-[#243a48] font-bold text-[15px]">
            IRP{" "}
            <span className="text-red-500">
              ({new Intl.NumberFormat("en-IN").format(data?.totalExposure?.toFixed(2) || 0)})
            </span>
          </div>
        </div>

        <div className="border-b border-gray-200 px-[20px] py-[7px]">
          {/* Available Balance */}
          <div className="text-left mt-1.5 text-[#9B9B99] text-xs font-bold">
            Available Balance
          </div>
          <div className="text-left mt-1.5 text-[#243a48] font-bold text-[15px]">
            IRP {new Intl.NumberFormat("en-IN").format(data?.allAvailableBalance?.toFixed(2) || 0)}
          </div>
        </div>
        
        <div className="border-b border-gray-200 px-[20px] py-[7px]">
          {/* Balance */}
          <div className="text-left mt-1.5 text-[#9B9B99] text-xs font-bold">
            Balance
          </div>
          <div className="text-left mt-1.5 text-[#243a48] font-bold text-[15px]">
            IRP {new Intl.NumberFormat("en-IN").format(data?.balance?.toFixed(2) || 0)}
          </div>
        </div>
        
        <div className="border-b border-gray-200 px-[20px] py-[7px]">
          {/* Total Available Balance */}
          <div className="text-left mt-1.5 text-[#9B9B99] text-xs font-bold">
            Total Avail. Bal
          </div>
          <div className="text-left mt-1.5 text-[#243a48] font-bold text-[15px]">
            IRP{" "}
            {new Intl.NumberFormat("en-IN").format(data?.totalAvailableBalance?.toFixed(2) || 0)}
          </div>
        </div>

        <div className="border-b border-gray-200 px-[20px] py-[7px]">
          {/* Upline P/L */}
          <div className="text-left mt-1.5 text-[#9B9B99] text-xs font-bold">
            Upline P/L
          </div>
          <div className={`text-left mt-1.5 text-[#243a48] font-bold text-[15px] ${data?.uplineProfitLoss < 0 ? 'text-red-500' : ''}`}>
            IRP {new Intl.NumberFormat("en-IN").format(data?.uplineProfitLoss?.toFixed(2) || 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceHeader;
