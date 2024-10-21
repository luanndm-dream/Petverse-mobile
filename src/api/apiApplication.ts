import {protectedAxios, publicAxios} from './apiConfiguration';

export async function apiPostApplication(
  userId: string,
  name: string,
  phoneNumber: string,
  address: string,
  image: any,
  description: string,
  petServiceIds: string[],
  certifications?: any[],
) {
  let url = 'Application';
  const formData = new FormData();
  formData.append('UserId', userId.toString());
  formData.append('Name', name.toString());
  formData.append('PhoneNumber', phoneNumber.toString());
  formData.append('Address', address.toString());
  formData.append('Image', image);
  formData.append('Description', description.toString());
  petServiceIds.forEach(id => {
    console.log(id); // Kiểm tra giá trị của id
    formData.append('PetServiceIds', id.toString());
  });
  if (certifications) {
    certifications.forEach(cert => {
      formData.append('Certifications', cert);
    });
  }

  console.log('formData', formData)
  return protectedAxios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
