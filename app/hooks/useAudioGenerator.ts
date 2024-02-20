import { generateAudioByText } from '@/app/services/AudioController';
import { useMutation } from '@tanstack/react-query';

export function useAudioGenerator() {
  const mutation = useMutation({
    mutationFn: generateAudioByText,
  });

  return {
    generateAudioByText: mutation.mutate,
    data: mutation.data?.data?.realPath,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
