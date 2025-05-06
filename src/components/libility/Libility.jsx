import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectBetListData, selectBetListError, selectBetListLoading } from '../../Store/Slice/betListSlice';
import { selectBetListFilter } from '../../Store/Slice/betListFilterSlice';
import { DeleteBet, RevertBet } from '../../Services/manageBetapi';
import moment from 'moment';
import LibilityFilter from './LibilityFilter';
import { pendingLiabilityBook } from '../../Store/Slice/pendingLiability';
import { useNavigate } from 'react-router-dom';

function Libility({ Userid }) {

  const dispatch = useDispatch();
  const data = useSelector(selectBetListData);
  const loading = useSelector(selectBetListLoading);
  const error = useSelector(selectBetListError);
  const navigate = useNavigate();
  const filters = useSelector(selectBetListFilter);
  const dataLiability = useSelector((state) => state.pendingLiability.data)
  const total = useSelector((state) => state.pendingLiability)
  const pages = useSelector((state) => state.pendingLiability?.pages)
  const [selectFilterData, setSelectFilterData] = useState({
    match: '',
    sport: '4',
    odds: '',
    session: '',
    status: 'REVERT',
    date1: '',
    date2: ''
  })
  const { sessions, loading: loader, error: err } = useSelector((state) => state);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [betlistData, setBetlistData] = useState([]);
  const [remarkModal, setRemarkModal] = useState(false);
  const [remark, setRemark] = useState('')
  const [totalBets, setTotalBets] = useState(0);
  const [checkbox, setCheckbox] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectBet, setSelectBet] = useState({})
  const [selectedUsername, setSelectedUsername] = useState(null);
   const PendingMarket = useSelector((state) => state.pendingMarket?.data)

  const [isDataFetched, setIsDataFetched] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "username",
    direction: "ascending",
  });

  const handleBetlistUpdate = (newData) => {
    setBetlistData(newData);
  };

  const handleDeleteBet = async (item) => {
    setRemarkModal(true)
    if(remark !== ''){
      try {
        const res = await DeleteBet('user/delete-bets', {
          betIds: checkbox?.length == 0 ? selectBet?._id : checkbox,
          matchId: selectFilterData?.match ? selectFilterData?.match : selectBet?.matchId,
          type: selectFilterData?.odds ? selectFilterData?.odds : selectBet?.matchType,
          remark: remark
        })
        if (res?.data?.success) {
          setSelectBet({})
          setRemark('')
          setRemarkModal(false)
        }
        console.log({ res })
      } catch (error) {
        setSelectBet({})
        setRemarkModal(false)
        console.log(error)
      }
    }
  }


  const handleRevertBet = async (item) => {
    try {
      const res = await RevertBet('user/revert-delete-bets', {
        betIds: checkbox?.length == 0 ? item?._id : checkbox,
        matchId: selectFilterData?.match ? selectFilterData?.match : item?.matchId,
        type: selectFilterData?.odds ? selectFilterData?.odds : item?.matchType,
      })

      if (res?.data?.success) {
        setSelectBet({})
          dispatch(pendingLiabilityBook({
                page : currentPage,
                limit : 10,
                sport : selectFilterData?.sport ,
                type : selectFilterData?.odds,
                matchId : selectFilterData?.match,
                sessionId : selectFilterData?.session,
                status : selectFilterData?.status
               }))
      }
      console.log({ res })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setBetlistData(data);
    setCurrentPage(1);
  }, [data, filters]);


  const handlePageChange = (direction) => {
    let newPage = currentPage;
    if (direction === "next" && currentPage < totalPages) newPage++;
    else if (direction === "prev" && currentPage > 1) newPage--;
    else if (direction === "first") newPage = 1;
    else if (direction === "last") newPage = totalPages;

    setCurrentPage(newPage);
  };
  const paginatedData = betlistData.slice(
    (currentPage - 1) * entriesToShow,
    currentPage * entriesToShow
  );

  console.log("Paginated Data:", paginatedData);
  useEffect(() => {
    if (total.total) {
      setTotalBets(total.total);
      setTotalPages(pages);
      // setBetlistData(data.data || []);
    }
  }, [total, pages])

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...betlistData].sort((a, b) => {
    const aValue = a[sortConfig.key] || "";
    const bValue = b[sortConfig.key] || "";
    if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
    return 0;
  });



  const handleCheckbox = (e) => {
    console.log(e.target.checked, checkbox, 'e.target.checked')
    if (e.target.checked && e.target.value == 'all') {
      const id = dataLiability?.map((item) => {
        return item?._id
      })
      setCheckbox(id)
      return
    } else if (!e.target.checked && e.target.value == 'all') {
      setCheckbox([])
      return
    }
    if (e.target.checked) {
      setCheckbox((pre) => setCheckbox([...pre, e.target.value]))
    } else {
      setCheckbox(checkbox.filter((item) => item !== e.target.value))
    }
  }





  console.log({  currentPage,entriesToShow,totalBets}, 'dataLiability')

  return (
    <>
    <div className="md:mx-0 mx-2 sm:mt-3 mt-2">
      <LibilityFilter
        setTotalBets={(total) => setTotalBets(total)}
        setTotalPages={(total) => setTotalPages(total)}
        setBetlistData={handleBetlistUpdate}
        entriesToShow={entriesToShow}
        handleDeleteBet={handleDeleteBet}
        handleRevertBet={handleRevertBet}
        checkbox={checkbox}
        remarkModal={remarkModal}
        currentPage={currentPage}
        selectFilterData={selectFilterData}
        setSelectFilterData={setSelectFilterData}
        setIsDataFetched={(isFetched) => console.log(isFetched)}
        setCurrentPage={setCurrentPage}
        userID={Userid}

      />
      {loading ?
        <div className="flex justify-center items-center h-64">
          <div className="relative w-48 h-48">
            <div className="absolute w-8 h-8 bg-gradient-green rounded-full animate-crossing1"></div>
            <div className="absolute w-8 h-8 bg-gradient-blue rounded-full animate-crossing2"></div>
            <div className="absolute bottom-[-40px] w-full text-center text-xl font-semibold text-black">
              Loading...
            </div>
          </div>
        </div> : ""}

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto sm:mt-8 mt-6">
          <table className="w-full table-auto border-collapse border border-gray-300 p-2">
            <thead className="border border-gray-300 bg-gray-200 text-black text-center">
              <tr className="text-center">
                {[
                  "sportName",
                  "event",
                  "market type",
                  "date",
                  "status",
                  // "odds",
                  // "amount",
                  // "potential",
                ].map((key) => (
                  <th
                    key={key}
                    className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center"
                    onClick={() => handleSort(key)}
                  >
                    <div className="flex flex-col">
                      <div className="text-center items-center">
                        <span>
                          {key === "sportName"
                            ? "Sport Name"
                            : key === "event"
                              ? "Event"
                              : key === "market type"
                                ? "Market Type"
                                : key === "date"
                                  ? "Date"
                                  :
                                  key === "status"
                                  ? "Status"
                                  // : key === "odds"
                                  //   ? "Odds"
                                    // : key === "amount"
                                    //   ? "Amount"
                                    //   : key === "potential"
                                    //     ? "Potentialwin"
                                        :  key
                          }
                        </span>
                        {/* {key === "" ?

                          <></>
                          :
                          <div className="flex flex-col items-center ml-2">
                            <FaSortUp
                              className={`${sortConfig.key === key &&
                                  sortConfig.direction === "ascending"
                                  ? "text-black"
                                  : "text-gray-400"
                                }`}
                              style={{
                                marginBottom: "-6px",
                              }}
                            />
                            <FaSortDown
                              className={`${sortConfig.key === key &&
                                  sortConfig.direction === "descending"
                                  ? "text-black"
                                  : "text-gray-400"
                                }`}
                              style={{
                                marginTop: "-6px",
                              }}
                            />
                          </div>
                        } */}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="text-center bg-white">
              {PendingMarket?.length > 0 ? (
                PendingMarket.map((item, index) => {
                  console.log(item,'item')
                  return(
                  <tr key={index}>
                  

                    <td
                      className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-linkcolor font-semibold cursor-pointer text-center"
                    >
                      {item.sport}
                    </td>

                    <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-linkcolor font-semibold cursor-pointer text-center"
                    // onClick={()=>{
                    //   navigate(`${ROUTES_CONST.PendingMarket}/${selectFilterData?.sport}/${item?._id}`)
                    // }}
                    >
                      {item.match}
                    </td>
                    <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center font-semibold">
                      {item?.PendingSelection?.toUpperCase()}
                    </td>
                    <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center">
                      {moment(item.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                    </td>
                    <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-yellow-600 cursor-pointer text-center">
                      Pending...
                    </td>
                    {/* <td className="border border-gray-400 px-4 py-3">
                      {item.odds}
                    </td> */}
                  
                    {/* <td
                      className="border border-gray-400 px-4 py-3"
                    >
                      {item?.amount?.toFixed(2) || 0}
                    </td>
                    <td className="border border-gray-400 px-4 py-3">
                      {item?.potentialWin?.toFixed(2) || 0}
                    </td> */}
                  
                  </tr>
                )})
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="border border-gray-300 px-4 py-3"
                  >
                    No data !
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>

      
    </>
  )
}

export default Libility
