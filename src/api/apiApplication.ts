import {protectedAxios, publicAxios} from './apiConfiguration';

export async function apiPostApplication(
  userId: string,
  name: string,
  phoneNumber: string,
  address: string,
  image: any,
  description: string,
  petServiceIds: string[],
  certifications?: string[],
) {
  let url = 'Application';
  const formData = new FormData();
  formData.append('UserId', userId.toString());
  formData.append('Name', name.toString());
  formData.append('PhoneNumber', phoneNumber.toString());
  formData.append('Address', address.toString());
  formData.append('Image', image.toString());
  formData.append('Description', description.toString());
  formData.append('PetServiceIds', petServiceIds);

  if (certifications) {
    formData.append('Certifications', certifications);
  }
  return publicAxios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
