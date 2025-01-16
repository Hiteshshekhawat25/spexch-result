import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBalanceData } from "../../Store/Slice/balanceSlice";
import { getBalanceData } from "../../Services/Downlinelistapi";

const BalanceHeader = () => {
  const dispatch = useDispatch();
  const balanceData = useSelector((state) => state.balance);
  console.log("balanceData", balanceData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getBalanceData("user/user-data-summary");
        console.log(response);
        if (response?.data?.success) {
          dispatch(setBalanceData(response.data.data));
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
    <div className="bg-white shadow-md rounded-md p-2 w-full mx-[5px] border border-b-2 border-blue-900">
      <div className="grid grid-cols-7 divide-x divide-gray-200">
        <div className="text-left 0 text-gray-500 text-sm font-medium pl-2">
          Total Balance
        </div>
        <div className="text-left 0 text-gray-500 text-sm font-medium pl-2">
          Total Exposure
        </div>
        <div className="text-left 0 text-gray-500 text-sm font-medium pl-2">
          Available Balance
        </div>
        <div className="text-left 0 text-gray-500 text-sm font-medium pl-2">
          Balance
        </div>
        <div className="text-left 0 text-gray-500 text-sm font-medium pl-2">
          Total Avail. Bal
        </div>
        <div className="text-left 0 text-gray-500 text-xs font-medium pl-2">
          Upline P/L
        </div>
        <div className="text-left 0 text-gray-500 text-xs font-medium pl-2"></div>
      </div>
      <div className="grid grid-cols-7 divide-x divide-gray-200">
        <div className="text-left 0 text-blue-800 text-md font-bold pl-2">
          IRP {new Intl.NumberFormat("en-IN").format(balanceData.totalBalance)}
        </div>
        <div className="text-left text-blue-800 text-md font-bold pl-2">
          IRP{" "}
          <span className="text-red-500">
            ({new Intl.NumberFormat("en-IN").format(balanceData.totalExposure)})
          </span>
        </div>
        <div className="text-left 0 text-blue-800 text-md font-bold pl-2">
          IRP{" "}
          {new Intl.NumberFormat("en-IN").format(balanceData.availableBalance)}
        </div>
        <div className="text-left 0 text-blue-800 text-md font-bold pl-2">
          IRP {new Intl.NumberFormat("en-IN").format(balanceData.balance)}
        </div>
        <div className="text-left 0 text-blue-800 text-md font-bold pl-2">
          IRP{" "}
          {new Intl.NumberFormat("en-IN").format(balanceData.totalavailbalance)}
        </div>
        <div className="text-left 0 text-blue-800 text-md font-bold pl-2">
          IRP {new Intl.NumberFormat("en-IN").format(balanceData.uplinePL)}
        </div>
        <div className="text-left 0 text-blue-800 text-md font-bold pl-2"></div>
      </div>
    </div>
  );
};

export default BalanceHeader;
