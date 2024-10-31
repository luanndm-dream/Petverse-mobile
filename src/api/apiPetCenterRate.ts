import { protectedAxios, publicAxios } from "./apiConfiguration"

export async function apiGetPetCenterRateByPetCenterId(petCenterId: string){
    const url = `PetCenterRate/${petCenterId}`
    return protectedAxios.get(url)
}