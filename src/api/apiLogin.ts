import { publicAxios } from "./apiConfiguration"
export async function apiLogin(email: string, password: string ){
    const url = `Auth/Login`
    const dataSend :{email: string, password: string}= {
        email: email,
        password: password
    }
    return publicAxios.post(url,dataSend)
}