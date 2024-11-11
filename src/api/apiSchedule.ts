import { mediaUpload } from "@/utils/mediaUpload"
import { protectedAxios } from "./apiConfiguration"

export async function apiCreateSchedule(scheduleId: string, Photos?: any[], Videos?: any[] ) {
    let url = `Schedule/${scheduleId}`

    const formData = new FormData()
    formData.append('ScheduleId', scheduleId),
    formData.append('Id', scheduleId)
    if(Photos){
        Photos.forEach((photo) => {
            formData.append('Photos', mediaUpload(photo))
        })
    }
    if(Videos){
        Videos.forEach((video) => {
            formData.append('Videos', mediaUpload(video))
        })
    }
    console.log(formData)
    return protectedAxios.post(url, formData,  {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
}