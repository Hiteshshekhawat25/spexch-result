import React, { useEffect, useState } from 'react'
import CasinoFilter from './CasinoFilter'
import SwitchButton from '../../common/SwitchButton'
import { fetchCasinoProviders } from '../../Store/Slice/casinoProvidersSlice';
import { useDispatch, useSelector } from 'react-redux';
import { LuRefreshCcw } from 'react-icons/lu';
import { MdViewHeadline } from 'react-icons/md'
import { updateCasinoStatus } from '../../Services/casinoServices';
import { fetchCasinoList } from '../../Store/Slice/CasinoListSlice';
import { useNavigate } from 'react-router-dom';
import { ROUTES_CONST } from '../../Constant/routesConstant';

function Casino() {

    const [active, setActive] = useState(false);
    const [i, setI] = useState('');
    const casinoProviders = useSelector((state) => state.casinoProviders)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchCasinoProviders())
    }, [])

    const handleUpdateStatus = async (id, status) => {
        console.log(id, status, 'id,status')
        setActive(true)
        setI(id)
        try {
            const res = await updateCasinoStatus(status == true ? false : true, id)
            console.log({ res }, 'res')
            dispatch(fetchCasinoProviders())
        } catch (error) {
            console.log(error, 'error')
        }
    }

    console.log('Casino', casinoProviders)
    return (
        <div className="md:mx-0 mx-2 mt-3">
            <div className="border border-gray-300 rounded-[5px] overflow-hidden bg-white md:p-4 p-3 ">
                <CasinoFilter />
                <div className='overflow-x-auto sm:mt-3 mt-2'>
                    <table className='w-full mt-3 rounded-md'>
                        <tr className='bg-gray-200'>
                            <th className='border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center'>
                                SR.no
                            </th>
                            <th className='border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center'>
                                Name
                            </th>
                            <th className='border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center'>
                                Status
                            </th>
                            <th className='border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center'>
                                Actions
                            </th>
                        </tr>
                        {casinoProviders?.data?.map((item, index) => (
                            <tr>
                                <td className='border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center'>
                                    {index + 1}
                                </td>
                                <td className='border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center'>
                                    {item?.provider}
                                </td>
                                <td className='border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center'
                                    onClick={() => {
                                        handleUpdateStatus(item?._id, item?.active)
                                    }}
                                >
                                    <span className='flex items-center justify-center'>
                                        <SwitchButton
                                            setActive={setActive}
                                            active={item?.active}
                                        />
                                    </span>
                                </td>
                                <td className='border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center'>
                                    <div className='flex justify-center gap-2'>
                                        <button className='p-2 bg-slate-100 rounded border border-gray-300'>
                                            <LuRefreshCcw />
                                        </button>
                                        <button className='p-2 bg-slate-100 rounded border border-gray-300'
                                            onClick={() => {
                                                dispatch(fetchCasinoList({id:item?._id,page : 1,perPage : 10}))
                                                navigate(`${ROUTES_CONST.CasinoGamesList}/${item?._id}`)
                                            }}
                                        >
                                            <MdViewHeadline />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </table>
                </div>

            </div>
        </div>
    )
}

export default Casino
