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


    
    console.log('Casino',casinoGamesList)
  return (
    <div
    className='p-3 items-center max-w-[1150px] mx-auto'
    >
      <CasinoFilter/>
      <div>
        <table className='w-full mt-3 rounded-md'>
            <tr>
            <th className='border border-slate-400 bg-slate-200 w-32 p-2 text-center'>
                    SR.no
                </th>
                <th className='border border-slate-400 p-2 bg-slate-200 text-center'>
                    Name
                </th>
                <th className='border border-slate-400 p-2 bg-slate-200 text-center'>
                    Status
                </th>
                <th className='border border-slate-400 p-2 bg-slate-200 text-center'>
                    Actions
                </th>
            </tr>
           {casinoGamesList?.data?.map((item,index)=>(
            <tr>
                <td className='border p-2'>
                    {index+1}
                </td>
                <td  className='border p-2 text-center'>
                    {item?.provider}
                </td>
                <td className='items-center border justify-center flex p-2'
                onClick={()=>{
                    handleUpdateStatus(item?._id,item?.active)
                }}
                >
                   <SwitchButton
                   setActive={setActive}
                   active={item?.active}
                   />

                </td>
                <td  className='border p-2'>
                    <div className='flex justify-center'>
                    <button className='p-2 shadow-md bg-slate-100 rounded' >
                        <LuRefreshCcw/>
                    </button>
                    <button className='p-2 shadow-md bg-slate-100 rounded' 
                    >
                        <MdViewHeadline/>
                    </button>
                    </div>
                </td>
            </tr>
           ))}
        </table>
      </div>
    </div>
  )
}

export default GamesList
