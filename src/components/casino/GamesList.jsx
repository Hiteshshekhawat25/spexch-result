import React, { useEffect, useState } from 'react'
import CasinoFilter from './CasinoFilter'
import SwitchButton from '../../common/SwitchButton'
import { fetchCasinoProviders } from '../../Store/Slice/casinoProvidersSlice';
import { useDispatch, useSelector } from 'react-redux';
import {LuRefreshCcw} from 'react-icons/lu';
import { MdViewHeadline } from 'react-icons/md'
import { updateCasinoStatus } from '../../Services/casinoServices';
import { fetchCasinoList } from '../../Store/Slice/CasinoListSlice';
import { useParams } from 'react-router-dom';

function GamesList() {

    const [active,setActive] = useState(false);
    const { id } = useParams();
    const [page,setPage] = useState(1)
    const [perPage,setPerPage] = useState(10)
    const [i,setI] = useState('');
    const casinoGamesList = useSelector((state)=>state.CasinoList)
    const dispatch = useDispatch();

    

    const handleUpdateStatus=async(ids,status)=>{
        console.log(ids,status,'id,status')
        setActive(true)
        setI(ids)    
        try{
            const res = await updateCasinoStatus(status == true ? false : true  , ids)
            console.log({res},'res')
            dispatch(fetchCasinoList({id:id}))
        }catch(error){
            console.log(error,'error')
        }
    }

    useEffect(()=>{
        if(id){
            dispatch(fetchCasinoList({id:id,page : page,perPage : perPage}))
        }
    },[id])


    
    console.log('Casino',casinoGamesList)
  return (
    <div className='md:mx-0 mx-2 mt-3 border border-gray-300 rounded-[5px] overflow-hidden bg-white md:p-4 p-3'
    >
      <CasinoFilter/>
      <div className='overflow-x-auto sm:mt-3 mt-2'>
        <table className='w-full mt-3 rounded-md border border-gray-300'>
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
                {/* <th className='border border-slate-400 p-2 bg-slate-200 text-center'>
                    Actions
                </th> */}
            </tr>
           {casinoGamesList?.data?.map((item,index)=>(
            <tr>
                <td className='border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center'>
                    {index+1}
                </td>
                <td  className='border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center'>
                    {item?.provider}
                </td>
                <td className='border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center'
                onClick={()=>{
                    handleUpdateStatus(item?._id,item?.active)
                }}
                >
                  <span className='flex items-center justify-center'>
                    <SwitchButton
                    setActive={setActive}
                    active={item?.active}
                    />
                  </span>

                </td>
                {/* <td  className='border p-2'>
                    <div className='flex justify-center'>
                    <button className='p-2 shadow-md bg-slate-100 rounded' >
                        <LuRefreshCcw/>
                    </button>
                    <button className='p-2 shadow-md bg-slate-100 rounded' 
                    >
                        <MdViewHeadline/>
                    </button>
                    </div>
                </td> */}
            </tr>
           ))}
        </table>
      </div>
    </div>
  )
}

export default GamesList
