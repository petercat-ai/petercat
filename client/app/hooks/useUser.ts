import {
  getUserInfo
} from '@/app/services/UserController';
import { useQuery } from '@tanstack/react-query';



function useUser() {
  const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;
  return useQuery({
    queryKey: [`user.userinfo`],
    queryFn: async () => getUserInfo(),
    retry: false,
  });
}

export default useUser;
