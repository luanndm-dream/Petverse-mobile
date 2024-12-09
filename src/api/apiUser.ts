import {mediaUpload} from '@/utils/mediaUpload';
import {protectedAxios} from './apiConfiguration';

export async function apiGetUserByUserId(userId: string) {
  const url = `User/${userId}`;

  return protectedAxios.get(url);
}
// export async function apiUpdateUser(
//   userId: string,
//   fullName: string,
//   gender: number,
// ) {
//   const url = `User/${userId}`;

//   return protectedAxios.get(url);
// }

export async function apiChangeAvatar(userId: string, avatar: any) {
  const url = `User/${userId}`;
  const formData = new FormData();

  formData.append('Id', userId);
  formData.append('Avatar', mediaUpload(avatar));

  return protectedAxios.put(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
export async function apiUpdateUser(
  userId: string,
  fullName?: string,
  gender?: number,
  address?: string,
  phoneNumber?: string,
) {
  const url = `User/${userId}`;
  const formData = new FormData();

  formData.append('Id', userId);
  formData.append('FullName', fullName);
  formData.append('Gender', gender);
  formData.append('Address', address);
  formData.append('PhoneNumber', phoneNumber);
  
  return protectedAxios.put(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function apiChangePassword(userId: string, currentPassword: string, newPassword: string) {
    let url = `User/${userId}/ChangePassword`

    const dataSend = {
      id: userId,
      currentPassword: currentPassword,
      newPassword: newPassword
    }

    return protectedAxios.put(url,dataSend)
}