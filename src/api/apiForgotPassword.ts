import { publicAxios } from "./apiConfiguration"
export async function apiForgotPassword(email: string, newPassword: string){
    const url = `Auth/ForgetPassword`
    const dataSend = {
        email: email,
        newPassword: newPassword,
    }
    return publicAxios.post(url,dataSend)
}