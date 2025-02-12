import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMarketList } from "../../Store/Slice/marketAnalysisSlice";
import { useNavigate } from "react-router-dom";

const MarketAnalysis = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = useSelector((state) => state?.marketList);

  useEffect(() => {
    dispatch(fetchMarketList());
  }, []);

  console.log("data", data);
  return (
    <>
      {data?.length
        ? data?.map((item) => (
            <React.Fragment key={item?._id}>
              <div className="mt-4 bg-gradient-blue text-white px-3 py-1.5 text-sm font-medium rounded mb-1">
                {item?._id}
              </div>
              {item?.betCounts?.length
                ? item?.betCounts?.map((el) => (
                    <div
                      onClick={() => navigate(`/market-analysis/${el?._id}`)}
                      key={el?._id}
                      className="bg-white px-2 py-1 border rounded mb-1.5 text-sm font-semibold border-gray-400 flex items-center justify-between cursor-pointer"
                    >
                      <span className="text-[#2789ce]">{el?.match}</span>
                      <span>Total Bets : {el?.betCount}</span>
                    </div>
                  ))
                : ""}
            </React.Fragment>
          ))
        : 
        <div className="text-slate-500 text-xl font-bold w-full border border-slate-500 p-2 rounded-md text-center">
        No Bets Found!
      </div>
        }
    </>
  );
};

export default MarketAnalysis;