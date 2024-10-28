import { protectedAxios } from "./apiConfiguration";

export async function apiGetUserByUserId(userId: string) {
    const url = `User/${userId}`;
  
    return protectedAxios.get(url);
  }