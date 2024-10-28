import {publicAxios} from './apiConfiguration';

export async function apigetRole() {
  let url = 'Role';
  return publicAxios.get(url);
}
