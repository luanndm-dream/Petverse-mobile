import { publicAxios } from "./apiConfiguration"

export async function apiGetPetByUserId(userId:string) {
    const url = `Pet/${userId}`

    return publicAxios.get(url)
}