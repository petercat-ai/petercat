import { useMutation, useQuery } from '@tanstack/react-query';
import {
  acceptAgreement,
  getAgreementStatus,
} from '@/app/services/UserController';
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

export const useAgreementStatus = () => {
  return useQuery({
    queryKey: [`agreement`],
    queryFn: async () => getAgreementStatus(),
    retry: false,
  });
};
