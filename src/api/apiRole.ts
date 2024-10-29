import {protectedAxios, publicAxios} from './apiConfiguration';

export async function apigetRole() {
  let url = 'Role';
  return protectedAxios.get(url);
}
