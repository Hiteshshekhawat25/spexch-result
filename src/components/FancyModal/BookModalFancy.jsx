import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

const BookFancyModal = ({openBets, selectedFancy,matchBetsData,bookData,show,setShow}) => {
  const dispatch = useDispatch()
  const [bookDataArray, setBookDataArray] = useState([])

  const handleClose = ()=> {
    setShow(false)
    setBookDataArray([])
  }

  const returnRollingCommissionTable = (data) => {
    console.log({data},'rolling')
    const allEntries = Object?.entries(data||{}).map(([key, value]) => {
      return { key, value };
    });
    return allEntries
  }

  // useEffect(()=> {
  //   const array = []
  //   if(openBets?.length) {
  //     const bookData = openBets?.filter((item) => item?.type === 'fancy' && item?.selectionId === selectedFancy)
  //     console.log('bookDatabookDatabookDatabookData', bookData)
  //     if(bookData?.length) {
  //       for (let i = 0; i < bookData.length; i++) {
  //         if(bookData[i]?.betType === 'lay' || bookData[i]?.betType === 'no' ) {
  //           const element = [
  //             {
  //               [Number(bookData[i]?.fancyOdds) - 5] : bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) - 4] : bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) - 3] : bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) - 2] : bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) - 1] : bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds)] : - bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) + 1] : - bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) + 2] : - bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) + 3] : - bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) + 4] : - bookData[i]?.potentialWin,
  //             }
  //           ];
  //           array.push(element?.[0])
  //         } else {
  //           const element = [
  //             {
  //               [Number(bookData[i]?.fancyOdds) - 5] : - bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) - 4] : - bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) - 3] : - bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) - 2] : - bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) - 1] : - bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds)] :  bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) + 1] : bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) + 2] : bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) + 3] : bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) + 4] : bookData[i]?.potentialWin,
  //             }
  //           ];
  //           array.push(element?.[0])
  //         }
  //       }
  //       if(array?.length) {
  //         const result = array?.reduce((acc, curr) => {
  //           Object.keys(curr).forEach(key => {
  //             acc[key] = (acc[key] || 0) + curr[key];
  //           });
  //           return acc;
  //         }, {});
  //         setBookDataArray(result)
  //         console.log('arrayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy', result)
          
  //       }
  //     }
  //   }

  // }, [openBets, selectedFancy])


  // useEffect(() => {
  //   const array = [];
  //   let previousRange = null; // Track the range from the previous iteration
  
  //   if (openBets?.length) {
  //     const bookData = openBets?.filter(
  //       (item) => item?.type === 'fancy' && item?.selectionId === selectedFancy
  //     )?.sort((a, b) => Number(a?.fancyOdds) - Number(b?.fancyOdds));  
  //     if (bookData?.length) {
  //       for (let i = 0; i < bookData.length; i++) {
  //         const currentOdds = Number(bookData[i]?.fancyOdds);
  //         const potentialWin = bookData[i]?.potentialWin;


  
  //         // Calculate dynamic range based on previous values
  //         const lowerBound = previousRange
  //           ? Math.min(previousRange[0], currentOdds - 5)
  //           : currentOdds - 5;
  //         const upperBound = previousRange
  //           ? Math.max(previousRange[1], currentOdds + 4)
  //           : currentOdds + 4;

  
  //         const element = {};
  
  //         for (let j = lowerBound; j <= upperBound; j++) {
  //           if (j < currentOdds) {
  //             element[j] = bookData[i]?.betType === 'lay' || bookData[i]?.betType === 'no'
  //               ? potentialWin
  //               : -potentialWin;
  //           } else if (j === currentOdds) {
  //             element[j] = bookData[i]?.betType === 'lay' || bookData[i]?.betType === 'no'
  //               ? -potentialWin
  //               : potentialWin;
  //           } else {
  //             element[j] = bookData[i]?.betType === 'lay' || bookData[i]?.betType === 'no'
  //               ? -potentialWin
  //               : potentialWin;
  //           }
  //         }

  //         console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',previousRange, bookData[i]?.betType, currentOdds, potentialWin, lowerBound, upperBound, element)

  
  //         array.push(element);
  
  //         // Update the previous range for the next iteration
  //         previousRange = [lowerBound, upperBound];
  //       }
  
  //       if (array?.length) {
  //         const result = array.reduce((acc, curr) => {
  //           Object.keys(curr).forEach((key) => {
  //             acc[key] = (acc[key] || 0) + curr[key];
  //           });
  //           return acc;
  //         }, {});
  
  //         setBookDataArray(result);
  //         console.log('Final Result:', result);
  //       }
  //     }
  //   }
  // }, [openBets, selectedFancy]);

  useEffect(() => {
    const array = [];
  
    if (openBets?.length) {
      // Filter and sort the data
      const bookData1 = bookData?.filter((item) =>item?.marketName == selectedFancy)

      if (bookData1?.length) {
        // Calculate the global range
        const allOdds = bookData.map((item) => Number(item?.fancyOdds));
        console.log(allOdds,'yuioop')
        const globalLowerBound = Math.min(...allOdds) - 10;
        const globalUpperBound = Math.max(...allOdds) + 10;
        
        // Create a range from the global bounds
        for (let i = 0; i < bookData.length; i++) {
          const currentOdds = Number(bookData[i]?.fancyOdds);
          const amount = bookData[i]?.amount;
          const potentialWin = bookData[i]?.potentialWin;
          
          
          console.log('potentialWinpotentialWin', allOdds,potentialWin,selectedFancy)
  
          const element = {};
  
          // Loop through the global range
          for (let j = globalLowerBound; j <= globalUpperBound; j++) {
            if (j < currentOdds) {
              element[j] =
                bookData[i]?.betType === 'lay' || bookData[i]?.betType === 'no'
                  ? amount
                  : -potentialWin;
            } else if (j === currentOdds) {
              element[j] =
                bookData[i]?.betType === 'lay' || bookData[i]?.betType === 'no'
                  ? -amount
                  : potentialWin;
            } else {
              element[j] =
                bookData[i]?.betType === 'lay' || bookData[i]?.betType === 'no'
                  ? -amount
                  : potentialWin;
            }
          }
  
          console.log('Element for currentOdds:', currentOdds, element);
  
          // Push the element to the array
          array.push(element);
        }
  
        // Aggregate all elements into the final result
        if (array?.length) {
          const result = array.reduce((acc, curr) => {
            Object.keys(curr).forEach((key) => {
              acc[key] = (acc[key] || 0) + curr[key];
            });
            return acc;
          }, {});
  
          setBookDataArray(result);
          console.log('Final Result:', result);
        }
      }
    }
  }, [openBets, selectedFancy, show]);
  
  

  console.log({openBets,bookDataArray},'fancyprice111')
  

  return (
    <>
      <div onClick={handleClose} className={`h-dvh w-full fixed z-[500] top-0 left-0 items-center justify-center bg-black/40 transition-all duration-500 ease-in-out ${show ? 'flex' : 'hidden'}`} style={{backdropFilter: 'blur(4px)'}}>
        <div className="w-full md:mt-0 sm:max-w-lg xl:p-0 relative z-10 mx-3 h-[95dvh] overflow-hidden flex items-center">
          <div onClick={(e)=> {e.stopPropagation()}} className="max-h-full w-full overflow-hidden flex flex-col bg-white rounded-lg shadow dark:border">
            <div className="modal-header flex-shrink-0 flex px-4 py-3 items-center justify-between border-b border-gray-200">
              <div className="title text-lg font-semibold">Book</div>
              <button onClick={handleClose}>
                <img className="h-3 object-contain" src="assets/img/closeIcon.png" alt="" />
              </button>
            </div>
            <div className="modal-body flex-1 overflow-y-auto text-md relative">
              <div className="overflow-y-auto w-full">
                <table className="w-full">
                  <tbody>
                    {
                      returnRollingCommissionTable(bookData)?.length ? 
                      returnRollingCommissionTable(bookDataArray)?.map(item => (
                        <>
                        {
                          item?.key < 0 ? "" :
                          <tr>
                            <td className={`font-semibold text-left py-2 px-4 border text-nowrap w-60 overflow-hidden capitalize ${item?.value > 0 ? 'bg-[#72bbef]' : 'bg-[#faa9ba]'}`}>{item?.key}</td>
                            <td className={`text-left py-2 px-4 border text-nowrap ${item?.value > 0 ? 'bg-[#72bbef]' : 'bg-[#faa9ba]'}`}>{item?.value}</td>
                          </tr>
                        }
                        </>
                      ))
                      : <tr>
                        <td colSpan={2} className="text-center py-4">
                          No Data Available
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BookFancyModal