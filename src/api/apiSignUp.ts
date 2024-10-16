import { publicAxios } from "./apiConfiguration"
export async function apiSignUp(fullname: string,email: string, password: string, phoneNumber: string ){
    const url = `User`
    const dataSend = {
        fullName: fullname,
        email: email,
        password: password,
        phoneNumber: phoneNumber
    }
    return publicAxios.post(url,dataSend)
}