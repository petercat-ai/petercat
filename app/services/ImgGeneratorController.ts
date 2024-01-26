import axios from 'axios';
/* generate img from prompt */
export async function generateImgByPrompt(params: { prompt: string }) {
  const response = await axios.get(`/api/chat/image?prompt=${params?.prompt}`);
  return response.data;
}
