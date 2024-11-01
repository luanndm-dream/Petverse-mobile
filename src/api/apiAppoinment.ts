import {protectedAxios} from './apiConfiguration';

export async function apiCreateServiceAppointment(
  userId: string,
  petId: string,
  petCenterServiceId: string,
  amount: number,
  startTime: string,
  endTime: string,
) {
  const url = 'Appointment/ServiceAppointment';
  const dataSend = {
    userId,
    petId,
    petCenterServiceId,
    amount,
    startTime,
    endTime,
  };
  return protectedAxios.post(url, dataSend);
}
