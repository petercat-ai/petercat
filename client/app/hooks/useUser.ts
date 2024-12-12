import { useUser as useAssistUser } from '@petercatai/assistant';
import { useFingerprint } from './useFingerprint';
import { useQuery } from '@tanstack/react-query';
import { getUserRepos } from '../services/UserController';
import { map } from 'lodash';

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN!;

export const useUser = () => {
  const { data: fingerprint } = useFingerprint();
  const { user, isLoading, actions } = useAssistUser({
    apiDomain: API_DOMAIN,
    fingerprint: fingerprint?.visitorId!,
  });

  return {
    user,
    isLoading,
    actions,
    status: isLoading ? 'pending' : 'success',
  };
};

export const useUserRepos = (enabled: boolean) => {
  return useQuery({
    queryKey: [`user.repos`],
    queryFn: async () => getUserRepos(),
    enabled,
    select: (data) =>
      map(data.data, (item) => ({ label: item.name, key: item.name })),
    retry: true,
  });
};
