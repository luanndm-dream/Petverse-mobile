import { protectedAxios } from "./apiConfiguration"

export async function apiCreateReport(appointmentId: string, title: string, reason: string) {
    let url = 'Report'
    const dataSend = {
        appointmentId,
        title,
        reason
    }
    return protectedAxios.post(url,dataSend)
}