import {
  getUserInfo
} from '@/app/services/UserController';
import { useQuery } from '@tanstack/react-query';



function useUser() {
  return useQuery({
    queryKey: [`user.userinfo`],
    queryFn: async () => getUserInfo(),
    retry: false,
  });
}

export default useUser;
