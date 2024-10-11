import { useUser as useAssistUser } from '@petercatai/assistant';
import { useFingerprint } from './useFingerprint';

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN!;

export default function useUser() {
  const { data: fingerprint } = useFingerprint();
  const { user, isLoading, actions } = useAssistUser({
    apiDomain: API_DOMAIN,
    fingerprint: fingerprint?.visitorId!
  });

  return {
    user,
    isLoading,
    actions,
    status: isLoading ? "pending" : 'success',
  };
}
