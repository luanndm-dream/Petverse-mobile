import {protectedAxios, publicAxios} from './apiConfiguration';

export async function apiGetPetByUserId(
  userId: string,
  speciesId?: number,
  IncludeSterilized?: boolean,
) {
  const url = `Pet/${userId}`;

  // Cấu hình `params` nếu có `speciesId`
  const params = speciesId
    ? {
        params: {
          SpeciesId: speciesId,
          IncludeSterilized: IncludeSterilized,
        },
      }
    : {};

  return protectedAxios.get(url, params);
}

export async function apiGetPetSpecies() {
  const url = `Species`;

  return protectedAxios.get(url);
}
export async function apiGetPetBreed(speciesId: number) {
  const url = `Species/${speciesId}/Breed`;

  return protectedAxios.get(url);
}
export async function apiCreatePet(
  userId: string,
  SpeciesId: number,
  BreedId: number,
  Name: string,
  BirthDate: string,
  Gender: number,
  Weight: number,
  Sterilized: boolean,
  Avatar: any,
  Description?: string,
  PetPhotos?: any[],
  PetVideos?: any[],
) {
  const url = `Pet`;
  const formData = new FormData();
  formData.append('userId', userId);
  formData.append('SpeciesId', SpeciesId);
  formData.append('BreedId', BreedId);
  formData.append('Name', Name);
  formData.append('BirthDate', BirthDate);
  formData.append('Gender', Gender.toString());
  formData.append('Weight', Weight.toString());
  formData.append('Sterilized', Sterilized ? 'true' : 'false');
  formData.append('Avatar', Avatar);

  if (Description) {
    formData.append('Description', Description);
  }
  if (PetPhotos) {
    PetPhotos.forEach(photo => {
      formData.append('PetPhotos', photo);
    });
  }
  if (PetVideos) {
    PetVideos.forEach(video => {
      formData.append('PetVideos', video);
    });
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

export async function apiUpdatePet(
  petId: string,
  petName: string,
  weight: number,
  description: string,
  isSterilized: boolean,
) {
  let url = `Pet/${petId}`;
  const formData = new FormData();
  formData.append('Id', petId);
  formData.append('Name', petName);
  formData.append('Weight', weight);
  formData.append('Sterilized', isSterilized);
  formData.append('Description', description);

  return protectedAxios.put(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function apiUpdatePetAlbum(
  petId: string,
  PetPhotos?: any[],
  PetVideos?: any[],
  PetPhotoToDeleteId?: any[],
) {
  let url = `Pet/${petId}`;
  const formData = new FormData();
  formData.append('Id', petId);

  if (PetPhotos) {
    PetPhotos.forEach(photo => {
      formData.append('PetPhotos', photo);
    });
  }
  if (PetVideos) {
    PetVideos.forEach(video => {
      formData.append('PetVideos', video);
    });
  }
  if (PetPhotoToDeleteId) {
    PetPhotoToDeleteId.forEach(id => {
      formData.append('PetPhotosToDelete', id);
    });
  }

  return protectedAxios.put(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    maxContentLength: 10 * 1024 * 1024, // 10MB (nội dung)
    maxBodyLength: 10 * 1024 * 1024,
  });
}

export async function apiUpdatePetAvatar(petId: number, avatar: any) {
  let url = `Pet/${petId}`;
  const formData = new FormData();

  if (avatar) {
    formData.append('Avatar', avatar);
  }

  return protectedAxios.put(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function apiDeletePet(petId: number) {
  let url = `Pet/${petId}`;

  return protectedAxios.delete(url);
}
