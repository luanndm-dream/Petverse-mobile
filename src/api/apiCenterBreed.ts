import { mediaUpload } from '@/utils/mediaUpload';
import {protectedAxios} from './apiConfiguration';

export async function apiGetCenterBreedByPetCenterId(petCenterId: string) {
  const url = `CenterBreed/${petCenterId}`;

  return protectedAxios.get(url);
}

export async function apiGetCenterBreed(status: number) {
  const url = `CenterBreed`;
  const params = {
    Status: status
  }
  return protectedAxios.get(url,{params});
}

export async function apiGetCenterBreedByCenterBreedId(centerBreedId: string) {
    const url = `CenterBreed/${centerBreedId}`;
  
    return protectedAxios.get(url);
  }

  export async function apiDeleteCenterBreed(centerBreedId: string) {
    const url = `CenterBreed/${centerBreedId}`;
  
    return protectedAxios.delete(url);
  }
export async function apiCreateCenterBreed(
  petCenterId: string,
  speciesId: number,
  name: string,
  description: string,
  price: number,
  images: any[],
) {
  let url = 'CenterBreed';
  const formData = new FormData();

  formData.append('PetCenterId', petCenterId);
  formData.append('SpeciesId', speciesId);
  formData.append('Name', name);
  formData.append('Description', description);
  formData.append('Price', price);
  if (images) {
    images.forEach(img => {
      formData.append('Images', mediaUpload(img));
    });
  }

  return protectedAxios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

