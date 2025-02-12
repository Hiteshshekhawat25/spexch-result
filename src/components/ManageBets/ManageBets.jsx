import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectBetListData, selectBetListError, selectBetListLoading } from '../../Store/Slice/betListSlice';
import { selectBetListFilter } from '../../Store/Slice/betListFilterSlice';
import { FaSortDown, FaSortUp } from 'react-icons/fa';
import ManageBetFilter from './ManageBetFilter';
import { liabilityBook } from '../../Store/Slice/liabilitySlice';
import { getCreateNewMatchAPIAuth, getMatchList } from '../../Services/Newmatchapi';

function ManageBets({Userid}) {

    const dispatch = useDispatch();
  const data = useSelector(selectBetListData);
  const loading = useSelector(selectBetListLoading);
  const error = useSelector(selectBetListError);
  const filters = useSelector(selectBetListFilter);
  const dataLiability = useSelector((state)=>state.liability.data)
   const { sessions, loading : loader, error : err } = useSelector((state) => state);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [betlistData, setBetlistData] = useState([]);
  const [totalBets, setTotalBets] = useState(0);
  const [checkbox,setCheckbox] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState(null);

  const [isDataFetched, setIsDataFetched] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "username",
    direction: "ascending",
  });

  const handleBetlistUpdate = (newData) => {
    setBetlistData(newData);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  useEffect(() => {
    setBetlistData(data);
    setCurrentPage(1);
  }, [data, filters]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleEntriesChange = (e) => {
    setEntriesToShow(Number(e.target.value));
    setCurrentPage(1);
  };

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
  const handleFilterChange = (data) => {
    setTotalBets(data.pagination.totalTransactions || 0);
    setTotalPages(data.pagination.totalPages || 1);
    setBetlistData(data.data || []);
  };

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


  const handleCheckbox=(e)=>{
    console.log(e.target.checked,checkbox,'e.target.checked')
    if(e.target.checked && e.target.value == 'all'){
      const id = dataLiability?.map((item)=>{
        return   item?._id
      })
      setCheckbox(id)
      return
    }else if(!e.target.checked && e.target.value == 'all'){
      setCheckbox([])
      return
    }
    if(e.target.checked ){
      setCheckbox((pre)=>setCheckbox([...pre,e.target.value]))
    }else{
      setCheckbox(checkbox.filter((item)=> item !== e.target.value))
    }
  }

  





console.log({sessions},'dataLiability')

  return (
    <>
    <ManageBetFilter
     setTotalBets={(total) => setTotalBets(total)}
     setTotalPages={(total) => setTotalPages(total)}
     setBetlistData={handleBetlistUpdate}
     entriesToShow={entriesToShow}
     currentPage={currentPage}
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
                      <div className="overflow-x-auto p-4">
                        <table className="w-full table-auto border-collapse border border-gray-400 p-2">
                          <thead className="border border-gray-400 bg-gray-300 text-black text-center">
                            <tr className="text-center">
                              {[
                                "",
                                "sportName",
                                "event",
                                "market type",
                                "selection",
                                "odds",
                                "amount",
                                "potential",
                                "Actions"
                              ].map((key) => (
                                <th
                                  key={key}
                                  className="border border-gray-400 text-left px-4 text-sm font-medium text-black cursor-pointer p-1"
                                  onClick={() => handleSort(key)}
                                >
                                  <div className="flex flex-col border-b border-gray-300 pb-2">
                                    <div className="flex justify-between items-center">
                                      <span>
                                        {key  === "sportName"
                                          ? "Sport Name"
                                          : key === "event"
                                          ? "Event"
                                          : key === "market type"
                                          ? "Market Type"
                                          : key === "selection"
                                          ? "Selection"
                                          : key === "odds"
                                          ? "Odds"
                                          : key === "amount"
                                          ? "Amount"
                                          : key === "potential"
                                          ? "Potentialwin"
                                          : key  === "" ? 
                                        <input type='checkbox'
                                        value='all'
                                        onChange={handleCheckbox}
                                        /> : key
                                        }
                                      </span>
                                      {key  === "" ? 
                                      
                                     <></>
                                     : 
                                      <div className="flex flex-col items-center ml-2">
                                        <FaSortUp
                                          className={`${
                                            sortConfig.key === key &&
                                            sortConfig.direction === "ascending"
                                              ? "text-black"
                                              : "text-gray-400"
                                          }`}
                                          style={{
                                            marginBottom: "-6px",
                                          }}
                                        />
                                        <FaSortDown
                                          className={`${
                                            sortConfig.key === key &&
                                            sortConfig.direction === "descending"
                                              ? "text-black"
                                              : "text-gray-400"
                                          }`}
                                          style={{
                                            marginTop: "-6px",
                                          }}
                                        />
                                      </div>
                                      }
                                    </div>
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>
        
                          <tbody className="text-center">
                            {dataLiability?.length > 0 ? (
                              dataLiability.map((item, index) => (
                                <tr key={index}>
                                  <td>
                                  <input
                                  type='checkbox'
                                  checked={checkbox?.includes(item?._id) ? true : false}
                                  value={item?._id}
                                  onChange={handleCheckbox}
                                  />  
                                  </td>

                                  <td
                                    onClick={() => {
                                      console.log("Clicked Item:", item); // Log the entire item object
                                      console.log("Selected User ID:", item.createdBy);
                                      console.log("Selected User Name:", item.username);
                                      setSelectedUserId(item.createdBy);
                                      setSelectedUsername(item.username);
                                      setIsModalOpen(true);
                                    }}
                                    className="border border-gray-400 px-4 py-3 font-bold text-blue cursor-pointer"
                                  >
                                    {item.sport}
                                  </td>
        
                                  <td className="border border-gray-400 px-4 py-3">
                                    {item.event}
                                  </td>
                                  <td className="border border-gray-400 px-4 py-3">
                                    {item.marketType}
                                  </td>
                                  <td className="border border-gray-400 px-4 py-3">
                                    {item.selectionId}
                                  </td>
                                  <td className="border border-gray-400 px-4 py-3">
                                    {item.odds}
                                  </td>
                                  <td
                                    className="border border-gray-400 px-4 py-3"
                                  >
                                    {item.amount.toFixed(2) || 0}
                                  </td>
                                  <td className="border border-gray-400 px-4 py-3">
                                    {item.potentialWin.toFixed(2) || 0}
                                  </td>
                                  <td className='border border-gray-400 px-4 py-3'>
                                    <div>
                                      <button className='bg-red-500 text-white px-3 p-1 text-[12px] rounded'>
                                        Delete
                                      </button>
                                    </div>
                                  </td>
                                 
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan="10"
                                  className="border border-gray-400 px-4 py-3"
                                >
                                  No data !
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
        
                    <div className="flex flex-col p-2 sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0">
                      {/* Showing entries text */}
                      <div className="text-sm text-gray-600">
                        Showing{" "}
                        {totalBets === 0 ? 0 : (currentPage - 1) * entriesToShow + 1} to{" "}
                        {Math.min(currentPage * entriesToShow, totalBets)} of{" "}
                        {totalBets} entries
                      </div>
        
                      {/* Pagination buttons */}
                      <div className="flex  space-x-2 sm:ml-auto">
                        <button
                          onClick={() => handlePageChange("first")}
                          className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
                          disabled={currentPage === 1}
                        >
                          First
                        </button>
                        <button
                          onClick={() => handlePageChange("prev")}
                          className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
                          disabled={currentPage === 1}
                        >
                          Prev
                        </button>
                        <div className='text-gray-600 rounded-md border px-3'>
                          {currentPage}
                        </div>
                        <button
                          onClick={() => handlePageChange("next")}
                          className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                        <button
                          onClick={() => handlePageChange("last")}
                          className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
                          disabled={currentPage === totalPages}
                        >
                          Last
                        </button>
                      </div>
                    </div>
    </>
  )
}

export default ManageBets
