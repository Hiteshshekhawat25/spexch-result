import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { pendingMarketBook } from '../../Store/Slice/pendingMarket';
import { useParams } from 'react-router-dom';

function PendingMarket() {

    const { id ,sportId} = useParams();
    const dispatch = useDispatch();
    const PendingMarket = useSelector((state) => state.pendingMarket?.data)

    useEffect(() => {
        dispatch(pendingMarketBook({ matchId: id }))
    }, [id])

    console.log(sportId, 'PendingMarket')

    return (
        <div className="overflow-x-auto p-4">
            <table className="w-full table-auto border-collapse border border-gray-400 p-2">
                <thead className="border border-gray-400 bg-gray-300 text-black text-center">
                    <tr className="text-center">
                        <th>
                            Sport
                        </th>
                        <th>
                            Market Name
                        </th>
                        <th>
                            Result Declare
                        </th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {PendingMarket?.map((item) => {
                        return (
                            <tr >
                                <td  className="border border-gray-400 px-4 py-3 font-bold text-blue cursor-pointer">
                                    {sportId == '4' ? 'Cricket' :  sportId == '1' ?  'Soccer'  :'Tennis' }
                                </td>
                                <td className="border border-gray-400  font-bold px-4 py-3">
                                    {item?.PendingSelection == 'odds'  ? 'MATCH ODDS' : item?.PendingSelection == 'bookmakers' ? 'BOOKMAKERS' : item?.PendingSelection == 'toss'  ? 'TOSS' : item?.PendingSelection }
                                </td>
                                <td className="border border-gray-400  text-yellow-500 font-bold px-4 py-3">
                                    Pending
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default PendingMarket
