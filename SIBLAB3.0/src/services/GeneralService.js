import axios from "axios";


export const getReport = async (id) =>{
    try {
        const url = `http://192.168.1.74:8080/api-siblab/report/`
        const response = await axios.get(url,{
            withCredentials:true
        });
        return response.data.data;
    }catch (err){
        return 'ERROR';
    }
}


export const getDocentes = async () =>{
    try {
        const url = `http://192.168.1.74:8080/api-siblab/user/`
        const response = await axios.get(url,{
            withCredentials:true
        });
        return response.data.data;
    }catch (err){
        return 'ERROR';
    }
}