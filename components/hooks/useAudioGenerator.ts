import { generateAudioByText } from '@/app/services/audioGeneratorController';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useAudioGenerator() {
  const mutation = useMutation({
    mutationFn: generateAudioByText,
  });
  console.log('response', mutation.data);
  return {
    generateAudioByText: mutation.mutate,
    data: mutation.data?.data?.realPath,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
