import axios from 'axios';


//  Get the public bot profile by id
export async function getUserInfo() {
  
  const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;
  const response = await axios.get(`${apiDomain}/api/auth/userinfo`);
  return response.data.data;
}