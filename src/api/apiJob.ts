import {protectedAxios} from './apiConfiguration';

export async function apiGetJobByPetCenterId(petCenterId: string) {
  const url = `Job/${petCenterId}`;

  return protectedAxios.get(url);
}

export async function apiCreateJob(
  petCenterId: string,
  description: string,
  havePhoto: boolean,
  haveCamera: boolean,
  haveTransport: boolean,
  speciesIds: any,
  petCenterService: any,
) {
  const url = `Job`;
  const dataSend = {
    petCenterId,
    description,
    haveCamera,
    havePhoto,
    haveTransport,
    speciesIds,
    petCenterService,
  };

  return protectedAxios.post(url, dataSend);
}

export async function apiUpdateJob(
  jobId: string,
  description: string,
  havePhoto: boolean,
  haveCamera: boolean,
  haveTransport: boolean,
  speciesIds: number[] | any,
) {
  let url = `Job/${jobId}`

  const dataSend = {
    id: jobId,
    description,
    havePhoto,
    haveCamera,
    haveTransport,
    speciesIds
  }
  // console.log('dataSend', dataSend)
  return protectedAxios.put(url, dataSend)

}
