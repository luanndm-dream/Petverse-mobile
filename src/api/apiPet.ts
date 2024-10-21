import { protectedAxios, publicAxios } from "./apiConfiguration"

export async function apiGetPetByUserId(userId:string) {
    const url = `Pet/${userId}`

    return protectedAxios.get(url)
}


export async function apiGetPetType() {
    const url = `PetType`

    return protectedAxios.get(url)
}
export async function apiGetPetSubType(petTypeId: number) {
    const url = `PetType/${petTypeId}/PetSubType`

    return protectedAxios.get(url)
}