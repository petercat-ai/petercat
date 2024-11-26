import { useMutation } from '@tanstack/react-query';
import { acceptAgreement } from '@/app/services/UserController';
export function useAgreement() {
  const mutation = useMutation({
    mutationFn: acceptAgreement,
  });

  return {
    data: mutation.data,
    acceptAgreement: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
