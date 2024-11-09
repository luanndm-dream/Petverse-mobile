import { useAppSelector } from '@/redux';
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

export async function apiCreateBreedAppointment(userId: string,
  centerBreedId: string,
  petId: string,
  amount: number,
  startTime: string,
  endTime: string
  ) {
  const url = 'Appointment/BreedAppointment'
  const dataSend = {
    userId,
    centerBreedId,
    petId,
    amount,
    startTime,
    endTime
  }
  return protectedAxios.post(url, dataSend)
}

export async function apiGetBreedAppointmentHistoryByUserId(type: number, userId: string, status: number) {
  const url = 'Appointment'
  const params = {
    type,
    userId,
    status
  }
  return protectedAxios.get(url, {params})
}

export async function apiGetMyAppointment(role: string, pageSize: number, id: string ) {
  const url = 'Appointment';
  const params = {
    pageSize,
    ...(role === 'customer' ? { userId: id } : { petCenterId: id })
  };

  return protectedAxios.get(url, { params });
}

export async function apiGetAppointmentByAppointmentId(appointmentId: string) {
  const url = `Appointment/${appointmentId}`;
  return protectedAxios.get(url);
}