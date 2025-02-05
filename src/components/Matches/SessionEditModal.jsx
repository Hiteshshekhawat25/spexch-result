import React from 'react'

function SessionEditModal({
    showUser,
    onChange,
    setShowUser,
    value,
    disabled,
    filteredSessions,
    tempResult,
    selectedSession,
    handleResultChange,
    handleSubmit,
    setSelectedSession,
    matchError,
    matchLoading,
    matchList,
}) {

    const handleClose = () => {
        setShowUser(false)
    }
    return (
        <div onClick={handleClose} className={`h-dvh w-full fixed z-[500] top-0 left-0 items-center justify-center bg-black/40 transition-all duration-500 ease-in-out ${showUser ? 'flex' : 'hidden'}`} style={{ backdropFilter: 'blur(4px)' }}>
            <div className="w-full md:mt-0 sm:max-w-[900px] xl:p-0 relative z-10 mx-3 h-[95dvh] overflow-hidden flex items-center">
                <div onClick={(e) => { e.stopPropagation() }} className="max-h-full w-full overflow-hidden flex flex-col bg-white rounded-lg shadow dark:border">
                    <div className="modal-header bg-gradient-blue text-white flex-shrink-0 flex px-4 py-3 items-center justify-between border-b border-gray-200">
                        <div className="title text-lg font-semibold">Update Session Result</div>
                        <button onClick={handleClose}>
                            <img className="h-3 object-contain" src="assets/img/closeIcon.png" alt="" />
                        </button>
                    </div>
                    <div className="modal-body flex-1 overflow-y-auto p-4 text-sm relative">
                        <div className="flex gap-6 mb-4">
                            {/* Select Match Dropdown */}
                            <div className="w-1/4">
                                <label
                                    htmlFor="match"
                                    className="block text-md font-bold text-gray-700 mb-1 text-left"
                                >
                                    Select Match
                                </label>
                                <select
                                    id="match"
                                    className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
                                    // onFocus={handleMatchSelectFocus}
                                    onChange={onChange}
                                    value={value}
                                    disabled={disabled}
                                >
                                    <option value="">Select Match</option>
                                    {matchLoading ? (
                                        <option>Loading...</option> // Display loading text
                                    ) : matchError ? (
                                        <option>{matchError}</option> // Display error message
                                    ) : (
                                        matchList.map((match) => (
                                            <option key={match._id} value={match._id}>
                                                {match.match} {match?.inPlay ? '(In Play)' : ''}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            {/* Select Session Dropdown */}
                            {console.log("matchhhhhhh", matchList)}
                            <div className="w-1/4">
                                <label
                                    htmlFor="session"
                                    className="block text-md font-bold text-gray-700 mb-1 text-left"
                                >
                                    Select Session
                                </label>
                                <select
                                    value={selectedSession}
                                    onChange={(e) => setSelectedSession(e.target.value)}
                                    id="session"
                                    className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
                                >
                                    <option value="">Select Session</option>
                                    {filteredSessions.filter((session) => !session.result).map((session, index) => (
                                        <option key={index} value={session.marketId}>
                                            {session.marketName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Result Input and Submit Button */}
                            <div className="w-2/4 flex items-end gap-4">
          <div className="w-1/2">
            <label
              htmlFor="result"
              className="block text-md font-bold text-gray-700 mb-1 text-left"
            >
              Result
            </label>
            <input
              id="result"
              value={tempResult}
              onChange={handleResultChange}
              type="number"
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
            />
          </div>
          <button className="px-4 py-2 bg-lightblue text-white font-semibold rounded hover:bg-blue-600" onClick={handleSubmit}>
            Submit
          </button>
        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SessionEditModal
