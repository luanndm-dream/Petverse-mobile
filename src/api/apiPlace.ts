import { protectedAxios } from "./apiConfiguration";

export async function apiGetPlaceForPet(
  speciesId?: number
) {
  const url = 'Place';
  const params = {
    pageSize: 10000,
    ...(speciesId && { speciesId }),
  };
  return protectedAxios.get(url, { params });
}