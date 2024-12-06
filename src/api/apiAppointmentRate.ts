import { protectedAxios } from "./apiConfiguration"

export async function apiCreateAppointmentRate(appointmentId: string, rate: number, description?: string) {

    let url = 'AppointmentRate'
    const dataSend = {
        appointmentId,
        rate,
        description
    }
    return protectedAxios.post(url, dataSend)
}