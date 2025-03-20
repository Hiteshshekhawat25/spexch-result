import React, { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { object } from 'yup';
import { deleteInstance, getInstance, postInstance, putInstance } from '../../Services/Newmatchapi';
import { BASE_URL } from '../../Constant/Api';
import axios from 'axios';

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


    const handleDelete=async(item)=>{
        try{
            const res = await deleteInstance(`/admin/delete-banner/${item?._id}`)
            console.log(res)
            getBannerList()
        }catch(error){
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
        getBannerList()
        setImageUrl('')
        setUpdate({})
        setImage((pre)=>({...pre,file : []}))
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
                <div className="bg-white rounded-md overflow-hidden lg:w-[850px] md:w-[700px] w-[96%] sm:mt-12 mt-4">
                    <div className="flex justify-between items-center bg-gradient-blue text-white font-semibold w-full p-2">
                        <div className='text-[15px]'>Add Banner</div>
                        <IoClose
                            onClick={onCancel}
                            className="cursor-pointer text-white text-2xl"
                        />
                    </div>
                    <div className='md:p-4 p-3 overflow-y-auto'>
                        <div className='flex  gap-3'>
                        <label className='text-[14px'>
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
                                <button className='bg-gradient-seablue max-h-12 rounded text-white font-bold text-[14px] py-2 px-4' 
                                onClick={handleSubmit}
                                >
                                {update?._id ? 'Update' : 'Add' }
                                </button>
                            </div>
                        </div>
                        <div className=' h-[400px] overflow-auto mt-4'>
                            <table className='w-full'>
                                <thead>
                                    <tr className='bg-gray-200'>
                                        <th className='border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-cente'>
                                            SR no.
                                        </th>
                                        <th className='border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-cente'>
                                            Banners
                                        </th>
                                        <th className='border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-cente'>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        image?.url?.length > 0 ?
                                    image?.url?.map((item,index)=>(
                                    <tr>
                                        <td className='border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center'>
                                            {index+1}
                                        </td>
                                        <td className='border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center text-center'>
                                        {item?.imageUrl ? 
                                            <img
                                            className='h-12 w-32 object-fill m-auto'
                                            src={item?.imageUrl}
                                            /> : 
                                            <span className='h-12 items-center text-nowrap'>
                                                No Banner, Please Update
                                            </span>
                                            }
                                        </td>
                                        <td className='border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center'>
                                            <div className='flex gap-2 justify-center'>
                                            <button 
                                            className='bg-lightblue px-3 py-1 font-bold text-white rounded'
                                            onClick={()=>{
                                                setUpdate(item)
                                                setImageUrl(item?.imageUrl)
                                                }}>
                                                Update
                                            </button>
                                            <button 
                                            className='bg-red-500 px-3 py-1 font-bold text-white rounded'
                                            onClick={()=>{
                                                handleDelete(item)
                                                }}>
                                                Delete
                                            </button>
                                            </div>
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
            </div>
        </>
    )
}

export default BannerModal