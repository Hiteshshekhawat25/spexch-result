
const Pagination = ({pageNo, setPageNo, totalPages}) => {

  const handlePrev = ()=> {
    if (pageNo < 2) return
    // setPageNo(prev => prev - 1)
    setPageNo(pageNo - 1)
  }

  const handleNext = ()=> {
    if (pageNo > totalPages - 1) return
    // setPageNo(prev => prev + 1)
    setPageNo(pageNo + 1)
  }

  const handlePageChange = (page) => {
    if(page >= 1 && page <= totalPages) {
      setPageNo(page)
    }
  }

  const renderPageNumber = ()=> {
    const PageNumbers = [];
    const maxPageNumbersToShow = 3;

    if(totalPages <= maxPageNumbersToShow) {
      // Show all pages if total pages are less than or equal to the max number to show
      for(let i = 1; i <= totalPages; i++) {
        PageNumbers.push(
          <li key={i} >
            <button 
              onClick={() => handlePageChange(i)} 
              className={`flex items-center justify-center size-[34px] border-r hover:no-underline hover:text-[#1D2939] border-[#D0D5DD] text-[#1D2939] font-semibold text-xs ${pageNo === i ? 'bg-[#F2F4F7]' : ""} `}>
              {i}
            </button>
        </li>
        )
      }
    } else {
      // For large numbers of pages, display ellipsis
      const halfWindow = Math.floor((maxPageNumbersToShow - 3) / 2);


      // first page
      PageNumbers.push(
        <li>
          <button 
            onClick={() => handlePageChange(1)} 
            className={`flex items-center justify-center size-[34px] border-r hover:no-underline hover:text-[#1D2939] border-[#D0D5DD] text-[#1D2939] font-semibold text-xs ${pageNo === 1 ? 'bg-[#F2F4F7]' : ""} `}>
            1
          </button>
        </li>
      )

      // Determine when to show the ellipsis and middle pages
        if (pageNo <= 2 + halfWindow) {
          // Case 1: Current page is near the start
          for (let i = 2; i <= 2 + halfWindow + 1; i++) {
            PageNumbers.push(
              <li key={i} >
                  <button 
                    onClick={() => handlePageChange(i)} 
                    className={`flex items-center justify-center size-[34px] border-r hover:no-underline hover:text-[#1D2939] border-[#D0D5DD] text-[#1D2939] font-semibold text-xs ${pageNo === i ? 'bg-[#F2F4F7]' : ""} `}>
                    {i}
                  </button>
              </li>
            );
          }
          PageNumbers.push(
                <li>
                  <button 
                    className={`flex items-center justify-center size-[34px] border-r hover:no-underline hover:text-[#1D2939] border-[#D0D5DD] text-[#1D2939] font-semibold text-xs`}>
                    ...
                  </button>
                </li>
          );
        } else if (pageNo >= totalPages - 1 - halfWindow) {
          // Case 2: Current page is near the end
          PageNumbers.push(
            <li>
            <button 
              className={`flex items-center justify-center size-[34px] border-r hover:no-underline hover:text-[#1D2939] border-[#D0D5DD] text-[#1D2939] font-semibold text-xs`}>
              ...
            </button>
          </li>
          );
          for (let i = totalPages - (2 + halfWindow); i < totalPages; i++) {
            PageNumbers.push(
              <li key={i} >
                  <button 
                    onClick={() => handlePageChange(i)} 
                    className={`flex items-center justify-center size-[34px] border-r hover:no-underline hover:text-[#1D2939] border-[#D0D5DD] text-[#1D2939] font-semibold text-xs ${pageNo === i ? 'bg-[#F2F4F7]' : ""} `}>
                    {i}
                  </button>
              </li>
            );
          }
        } else {
          // Case 3: Current page is in the middle
          PageNumbers.push(
                <li>
                  <button 
                    className={`flex items-center justify-center size-[34px] border-r hover:no-underline hover:text-[#1D2939] border-[#D0D5DD] text-[#1D2939] font-semibold text-xs`}>
                    ...
                  </button>
                </li>
          );
          for (let i = pageNo - halfWindow; i <= pageNo + halfWindow; i++) {
            PageNumbers.push(
              <li key={i} >
              <button 
                onClick={() => handlePageChange(i)} 
                className={`flex items-center justify-center size-[34px] border-r hover:no-underline hover:text-[#1D2939] border-[#D0D5DD] text-[#1D2939] font-semibold text-xs ${pageNo === i ? 'bg-[#F2F4F7]' : ""} `}>
                {i}
              </button>
          </li>
            );
          }
          PageNumbers.push(
            <li>
            <button 
              className={`flex items-center justify-center size-[34px] border-r hover:no-underline hover:text-[#1D2939] border-[#D0D5DD] text-[#1D2939] font-semibold text-xs`}>
              ...
            </button>
          </li>
          );
        }


      // last page
      if(totalPages > 1) {
        PageNumbers.push(
          <li>
            <button 
              onClick={() => handlePageChange(totalPages)} 
              className={`flex items-center justify-center size-[34px] border-r hover:no-underline hover:text-[#1D2939] border-[#D0D5DD] text-[#1D2939] font-semibold text-xs ${pageNo === totalPages ? 'bg-[#F2F4F7]' : ""} `}>
              {totalPages}
            </button>
          </li>
        )
      }
    }

    return PageNumbers
  }

  return (
    <>
      <ul className='border border-[#D0D5DD] rounded-md mb-0 flex items-center bg-white'>
        <li onClick={handlePrev}>
          <button className='flex items-center justify-center size-[34px] border-r hover:no-underline hover:text-[#1D2939] border-[#D0D5DD] '>
            <img width={17} height={17} src={'assets/img/arrow-left.png'} alt={'arrow-left'} />
          </button>
        </li>
        {renderPageNumber()}
        <li onClick={handleNext}>
          <button className='flex items-center justify-center size-[34px] '>
            <img width={17} height={17} src={'assets/img/arrow-right.png'} alt={'arrow-right-table'} />
          </button>
        </li>
      </ul>
    </>
  )
}

export default Pagination
