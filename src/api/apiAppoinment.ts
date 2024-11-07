import {protectedAxios} from './apiConfiguration';

export async function apiCreateServiceAppointment(
  userId: string,
  petId: string,
  petCenterServiceId: string,
  amount: number,
  startTime: string,
  endTime: string,
  schedules?: any
) {
  const url = 'Appointment/ServiceAppointment';
  const dataSend = {
    userId,
    petId,
    petCenterServiceId,
    amount,
    startTime,
    endTime,
    schedules
  };
  return protectedAxios.post(url, dataSend);
}
