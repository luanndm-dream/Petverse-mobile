import {protectedAxios} from './apiConfiguration';

export async function apiUpdatePetCenterService(
  PetCenterServiceId: string,
  Id: string,
  Price: number,
  Description: string,
  Type: number,
) {
  const url = `PetCenterService/${PetCenterServiceId}`;
  const formData = new FormData();
  formData.append('Id', Id);
  formData.append('Price', Price),
  formData.append('Description', Description),
  formData.append('Type', Type);

  return protectedAxios.put(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
