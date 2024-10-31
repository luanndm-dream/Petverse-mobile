import {protectedAxios} from './apiConfiguration';

export async function apiCreateServiceAppointment(
  userId: string,
  petId: string,
  petCenterServiceId: string,
  startTime: string,
  endTime: string,
) {
  const url = 'Appointment/ServiceAppoinment';
  const dataSend = {
    userId,
    petId,
    petCenterServiceId,
    startTime,
    endTime,
  };
  return protectedAxios.post(url, dataSend);
}
