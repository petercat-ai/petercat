import { BotProfile } from '../interface';

/* Create Bot*/
export async function createBot(profile: BotProfile) {
  return fetch('/api/bot/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  });
}

/* Update Bot*/
export async function updateBot(profile: BotProfile) {
  return fetch('/api/bot/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  });
}

/* Delete Bot*/
export async function deleteBot(id: string) {
  return fetch(`/api/bot/delete?id=${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/* get Bot detail*/
export async function getBotDetail(id: string) {
  return fetch(`/api/bot/delete?id=${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// /* Upload File */
// export async function uploadFile(params: UploadFileParams, file: any) {
//   return request(`${SERVER_HOST}/upload_files`, {
//     method: 'POST',
//     headers: {
//       Authorization: getLocalData('TUGRAPH_TOKEN'),
//       'Content-Type': 'application/json',
//       ...params,
//     },
//     body: file,
//   });
// }
