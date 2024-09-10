import axios from 'axios';

const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;

//  Get the public bot profile by id
export async function getUserInfo({ clientId }: { clientId?: string }) {  
  const response = await axios.get(`${apiDomain}/api/auth/userinfo?clientId=${clientId}`, { withCredentials: true });
  return response.data.data;
}


export async function getAvaliableLLMs() {
  const response = await axios.get(`${apiDomain}/api/user/llms`, { withCredentials: true });
  return response.data;
}
