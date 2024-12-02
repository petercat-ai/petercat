import axios from 'axios';

const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;

//  Get the public bot profile by id
export async function getUserInfo({ clientId }: { clientId?: string }) {
  const response = await axios.get(
    `${apiDomain}/api/auth/userinfo?clientId=${clientId}`,
    { withCredentials: true },
  );
  return response.data.data;
}

export async function acceptAgreement() {
  const response = await axios.post(
    `${apiDomain}/api/auth/accept/agreement`,
    {},
    { withCredentials: true },
  );
  return response.data;
}

export async function getAgreementStatus() {
  const response = await axios.get(`${apiDomain}/api/auth/agreement/status`, {
    withCredentials: true,
  });
  return response.data;
}

export async function getAvaliableLLMs() {
  const response = await axios.get(`${apiDomain}/api/user/llms`, {
    withCredentials: true,
  });
  return response.data;
}

export async function requestLogout() {
  const response = await axios.get(`${apiDomain}/api/auth/logout`, {
    withCredentials: true,
  });
  return response.data;
}
