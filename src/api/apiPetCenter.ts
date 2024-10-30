import {protectedAxios, publicAxios} from './apiConfiguration';
export async function apiGetPetCenter(pageSize?: number, pageIndex?: number) {
  const url = `PetCenter`;
  const params = {
    PageIndex: pageIndex,
    PageSize: pageSize,
  };
  return protectedAxios.get(url, {params});
}

export async function apiGetPetCenterByPetCenterId(petCenterId: string) {
  const url = `PetCenter/${petCenterId}`;
  return protectedAxios.get(url);
}
