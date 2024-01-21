import { generateImgByPrompt } from '@/app/services/ImgGeneratorController';
import useSWR from 'swr';

export const useImgGenerator = (params: { prompt: string }) => {
  return useSWR(['chat.imgGenerator', params.prompt], async () =>
    generateImgByPrompt(params),
  );
};
