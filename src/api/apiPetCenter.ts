import {protectedAxios, publicAxios} from './apiConfiguration';
export async function apiGetPetCenter(pageSize?: number, pageIndex?: number) {
  const url = `PetCenter`;
  const params = {
    PageIndex: 1,
    PageSize: 10000,
  };
  return protectedAxios.get(url, {params});
}

export async function apiGetPetCenterByPetCenterId(petCenterId: string) {
  const url = `PetCenter/${petCenterId}`;
  return protectedAxios.get(url);
}
export async function apiGetPetCenterByPetServiceId(petServiceId: string) {
  const url = `PetCenter`;
  const params = {
    PetServiceId: petServiceId,
    pageSize: 1000
  }
  return protectedAxios.get(url, {params});
}
