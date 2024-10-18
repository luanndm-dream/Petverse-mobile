import { publicAxios } from "./apiConfiguration"

export async function apiGetPetServices(){
    const url = `PetService`
    return publicAxios.get(url)
}