import { protectedAxios } from "./apiConfiguration";

export async function apiGetUserByUserId(userId: string) {
    const url = `User/${userId}`;
  
    return protectedAxios.get(url);
  }
  export async function apiUpdateUser(userId: string, fullName: string, gender: number, ) {
    const url = `User/${userId}`;
    
    return protectedAxios.get(url);
  }