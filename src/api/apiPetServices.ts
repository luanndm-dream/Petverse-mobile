import { protectedAxios, publicAxios } from "./apiConfiguration"

export async function apiGetPetServices(){
    const url = `PetService`
    return protectedAxios.get(url)
}