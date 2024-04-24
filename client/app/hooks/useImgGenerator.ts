import { generateImgByPrompt } from '@/app/services/ImgGeneratorController';
import { useQuery } from '@tanstack/react-query';

export const useImgGenerator = (params: { prompt: string }, id: string) => {
  return useQuery({
    queryKey: [`chat.img.${id}`, prompt],
    queryFn: async () => generateImgByPrompt(params),
    select: (data) => data?.data,
    enabled: !!params?.prompt,
    retry: false,
  });
};
