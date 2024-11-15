import { protectedAxios } from "./apiConfiguration"

export async function apiCreatePayment(userId:string, title: string, description: string, amount: number){
    let url = 'Transaction'
    const dataSend =  {
        userId,
        title,
        description,
        amount,
        returnUrl:'http://112.213.87.177:3000/success-transaction',
        cancelUrl: 'http://112.213.87.177:3000/fail-transaction'
    }
    return protectedAxios.post(url, dataSend)
}