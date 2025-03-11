import React, { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { object } from 'yup';
import { getInstance, postInstance, putInstance } from '../../Services/Newmatchapi';
import { BASE_URL } from '../../Constant/Api';

function BannerModal({ onCancel, image, setImage }) {

    const [imageUrl,setImageUrl] = useState('');
    const [update,setUpdate] = useState({});

    const handleChange = (e) => {
        let file = e.target.files[0]
        setImageUrl(URL.createObjectURL(e.target.files[0]))
        setImage((pre)=>({
            ...pre,         
            file: file,
        }))
    }


    const getBannerList = async () => {
        try {
            const res = await getInstance('/admin/get-banner')
            console.log(res?.data?.data, 'banner')
            setImage((pre)=>({...pre,url : res?.data?.data}))
        } catch (error) {
            console.log(error)
        }
    }

 const handleSubmit =async()=>{
    try{
        const formData = new FormData()
        formData.append('picture',image?.file)
        if(update?._id){
            const res = await putInstance(`/admin/update-banner/${update?._id}`,formData)
        }else{
            const res = await postInstance(`/admin/banner-upload`,formData)
        }
    }catch(error){
        console.log(error)
    }
 }

    useEffect(() => {
        getBannerList()
    }, [])
    console.log(imageUrl)
    return (
        <>
            <div className="fixed top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
                <div className="bg-white rounded-lg w-[850px] mt-20">
                    <div className="flex justify-between items-center bg-gradient-blue text-white text-lg font-custom font-semibold w-full p-2">
                        <span>Change Password</span>
                        <IoClose
                            onClick={onCancel}
                            className="cursor-pointer text-white text-2xl"
                        />
                    </div>
                    <div className='bg-white items-center p-3'>
                        <div className='flex  gap-3'>
                            <label>
                                <input
                                    className='w-[100px]'
                                    type='file'
                                    // multiple
                                    onChange={handleChange}
                                />
                            </label>
                          {imageUrl && 
                            <div>
                                <img
                                src={imageUrl}
                                className='h-24 w-full'
                                />
                            </div> }
                        <div className='flex w-full justify-end '>
                            <button className='bg-sky-500 max-h-12 rounded text-white font-bold  py-2 px-4' 
                            onClick={handleSubmit}
                            >
                                Add
                            </button>
                        </div>
                        </div>
                    </div>
                    <div className=' h-[400px] overflow-auto'>
                        <table className='w-full'>
                            <thead>
                                <tr>
                                    <th className='text-center'>
                                        SR no.
                                    </th>
                                    <th className='text-center'>
                                        Banners
                                    </th>
                                    <th className='text-center'>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    image?.url?.length > 0 ?
                                image?.url?.map((item,index)=>(
                                <tr>
                                    <td className='text-center  border border-gray-400'>
                                        {index+1}
                                    </td>
                                    <td className='flex items-center border border-gray-400 py-3 '>
                                        <img
                                        src={item?.imageUrl}
                                        />
                                    </td>
                                    <td className='text-center border border-gray-400 py-1'>
                                        <button 
                                        className='bg-lightblue px-3 py-1 font-bold text-white rounded'
                                        onClick={()=>{
                                            setUpdate(item)
                                            setImageUrl(item?.imageUrl)
                                            }}>
                                            Update
                                        </button>
                                    </td>
                                </tr>
                                )):
                                <div>
                                    No Data Found!
                                </div>
                            
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BannerModal