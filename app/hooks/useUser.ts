import useSWR from 'swr';

// 定义 fetcher 函数，这个函数用于发送 HTTP 请求
const fetcher = (url: string) => fetch(url, {
  method: 'GET',
  credentials: 'include', // 确保 cookies 被发送
}).then((res) => res.json());

function useUser() {
  const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;

  const { data, error } = useSWR(`${apiDomain}/api/auth/userinfo`, fetcher);
  return {
    user: data?.data ?? {},
    isLoading: !error && !data,
    isError: error
  };
}

export default useUser;
