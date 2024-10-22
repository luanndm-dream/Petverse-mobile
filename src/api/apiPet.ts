import {protectedAxios, publicAxios} from './apiConfiguration';

export async function apiGetPetByUserId(userId: string) {
  const url = `Pet/${userId}`;

  return protectedAxios.get(url);
}

export async function apiGetPetType() {
  const url = `PetType`;

  return protectedAxios.get(url);
}
export async function apiGetPetSubType(petTypeId: number) {
  const url = `PetType/${petTypeId}/PetSubType`;

  return protectedAxios.get(url);
}
export async function apiCreatePet(
  userId: string,
  PetTypeId: number,
  PetSubTypeId: number,
  Name: string,
  Gender: number,
  Weight: number,
  Sterilized: boolean,
  Avatar: any ,
  Description?: string,
  PetPhotos?: any[],
  Age?: number,
) {
  const url = `Pet`;
  const formData = new FormData();
  formData.append('userId', userId)
  formData.append('PetTypeId', PetTypeId.toString());
  formData.append('PetSubTypeId', PetSubTypeId.toString());
  formData.append('Name', Name);
  formData.append('Gender', Gender.toString());
  formData.append('Weight', Weight.toString());
  formData.append('Sterilized', Sterilized ? 'true' : 'false');
  formData.append('Avatar', Avatar);

  if (Description) {
    formData.append('Description', Description);
  }
  if (PetPhotos) {
    PetPhotos.forEach((photo) => {
      formData.append('PetPhotos', photo);
    });
  }
  if (Age) {
    formData.append('Age', Age.toString());
  }

  return protectedAxios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function apiGetPetByPetId(petId: string) {
  const url = `Pet/${petId}`;

  return protectedAxios.get(url);
}

