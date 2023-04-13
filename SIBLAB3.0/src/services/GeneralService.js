import axios from "axios";
import { Toast } from "react-native-toast-message/lib/src/Toast";


export const getReport = async (id) => {
    try {
        const url = `http://192.168.137.11:8080/api-siblab/report/`
        const response = await axios.get(url, {
            withCredentials: true

        });
        return response.data.data;
        
    } catch (err) {
        return 'ERROR';
    }
}


export const getDocentes = async () => {
    try {
        const url = `http://192.168.137.11:8080/api-siblab/user/`
        const response = await axios.get(url, {
            withCredentials: true

        });
        return response.data.data;
    } catch (err) {
        return 'ERROR';
    }
}
export const getUser = async (id) => {
    try {
        const url = `http://192.168.137.11:8080/api-siblab/user/${id}`
        const response = await axios.get(url, {
            withCredentials: true

        });
        return response.data.data;
    } catch (err) {
        return 'ERROR';
    }
}
export const LoginService = async (values) => {
    console.log('HOLA DESDE SERVICE', values.username);
    const formData = new FormData()
    formData.append('username', values.username)
    formData.append('password', values.password)
    const req = {
        method: 'POST',
        body: formData,
        credentials: 'include'
    }
    try {
        const res = await fetch('http://192.168.137.11:8080/api-siblab/login/', req)
        const data = await res.json()
        return data;
    } catch (error) {
        console.log('error desde loginSrvice', error)
    }

}

export const RegisterService = async (values) => {

    console.log("Register", values)
    try {
        const response = await axios.post("http://192.168.137.11:8080/api-siblab/user/", {
            email: values.email,
            password: values.password,
            name: values.name,
            surname: values.surname,
            code: values.code,
            role: "Student",
            classroom: {id:values.id_classroom},
        },
            {
                Withcredentials: true,
            }
        );

        return response;

    } catch (error) {
        console.log("Error register", error)
        if (error.response && error.response.data) {
            console.log("Error en los datos:", error.response.data);
            Toast.show({type:"error",position:"bottom",text1:"Matricula ya registrada"}) 
        }
    }

}

export const CreateReport = async (values) => {
    console.log("Values en report",values)
    try {
        const response = await axios.post("http://192.168.137.11:8080/api-siblab/report/", {
            status: "Pending_student",
            id_teacher: values.values.id_teacher,
            time_Register: values.values.time_Register,
            time_Finish: values.values.time_Finish,
            defect: false,
            student: {
                id: values.userData.id
            },
            info: values.values.info,
            machine: {
                id: values.data
            }
        },
            {
                Withcredentials: true,
            }
        );
        return response;
    } catch (error) {
        console.log("Error en createdReport", error)
    }
}