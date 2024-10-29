import { protectedAxios, publicAxios } from "./apiConfiguration"

export async function apiGetPetCenterByPetCenterId(petCenterId: string){
    const url = `PetCenter/${petCenterId}}`
    return protectedAxios.get(url)
}