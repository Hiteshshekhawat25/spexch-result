import axios from 'axios';
import { BASE_URL } from '../Constant/Api';



export const updateCasinoStatus = async (status, id) => {
    try {
        const token = localStorage.getItem('authToken')
        const res = await axios.post(`${BASE_URL}/casino/updategames/${id}`, {
            status: status
        }, {
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
        return res
    } catch (error) {
        console.log(error)
        return error
    }
}



export const getService=async(resource)=>{
    try{
        const token = localStorage.getItem('authToken')
        const res = await axios.get(`${BASE_URL}${resource}`,{
            headers:{
                "Authorization": `Bearer ${token}`,
                "Content-Type" : "application/json"
            }
        })
        return res
        
    }catch(error){
        console.log({...error})
    }
}
