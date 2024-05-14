'use client';

import {
  getUserInfo
} from '@/app/services/UserController';
import { useQuery } from '@tanstack/react-query';
import { useFingerprint } from './useFingerprint';

function useUser() {
  const { data } = useFingerprint();

  return useQuery({
    queryKey: [`user.userinfo`, data?.visitorId],
    queryFn: async () => getUserInfo({ clientId: data?.visitorId }),
    enabled: !!data?.visitorId,
    retry: false,
  });
}

export default useUser;
