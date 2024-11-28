import {protectedAxios} from './apiConfiguration';

export async function apiGetPetCenterServiceByPetServiceId(
  petcenterServiceId: number,
) {
  let url = `PetCenterService/${petcenterServiceId}`;
  return protectedAxios.get(url);
}

export async function apiUpdatePetCenterService(
  PetCenterServiceId: string,
  Price: number,
  Description: string,
  Type: number,
  Schedule: any,
) {
  const url = `PetCenterService/${PetCenterServiceId}`;

  const sendData = {
    id: PetCenterServiceId,
    price: Price,
    description: Description,
    type: Type,
    schedule: Schedule,
  };

  return protectedAxios.put(url, sendData);
}
