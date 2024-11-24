import { mediaUpload } from '@/utils/mediaUpload';
import {protectedAxios} from './apiConfiguration';

export async function apiCreateReport(
  appointmentId: string,
  title: string,
  reason: string,
  photos?: any[],
  videos?: any[],
) {
  let url = 'Report';
  const formData = new FormData();

  formData.append('AppointmentId', appointmentId);
  formData.append('Title', title);
  formData.append('Reason', reason);
  if (photos) {
    photos.forEach(photo => {
      formData.append('Photos', mediaUpload(photo));
    });
  }
  if (videos) {
    videos.forEach(video => {
      formData.append('Videos', mediaUpload(video));
    });
  }

  console.log(videos)
  return protectedAxios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function apiGetMyReportById(id: string, roleName: string){
  let url = 'Report'
  const params = {
    pageSize: 1000,
    ...(roleName === 'Customer'? {userId: id} : {petCenterId: id})
  }
  return protectedAxios.get(url,{params})
}

export async function apiGetReportByReportId(reportId: number){
  let url = `Report/${reportId}`
 
  return protectedAxios.get(url)
}