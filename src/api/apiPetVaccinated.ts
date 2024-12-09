import { mediaUpload } from "@/utils/mediaUpload"
import { protectedAxios } from "./apiConfiguration"

export async function apiCreatePetVaccinated(
    petId: number,
    vaccineName: string,
    image: any[],
    DateVaccinated: string,
    VaccineRecommendationId?: number,
) {
    let url = 'PetVaccinated'
    const formData = new FormData()
    formData.append('PetId', petId)
    formData.append('Name', vaccineName)
    formData.append('DateVaccinated', DateVaccinated)
    if (VaccineRecommendationId) {
      formData.append('VaccineRecommendationId', VaccineRecommendationId);
    }


    if (image) {
        image.forEach(image => {
          formData.append('image', mediaUpload(image));
        });
      }

    
    return protectedAxios.post(url, formData,  {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
}