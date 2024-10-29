import { protectedAxios } from "./apiConfiguration";

export async function apiGetJobByPetCenterId(petCenterId: string) {
    const url = `Job/${petCenterId}`;
  
    return protectedAxios.get(url);
  }
  