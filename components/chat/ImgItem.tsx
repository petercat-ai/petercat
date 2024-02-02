'use client';
import { Avatar, CircularProgress, Image } from '@nextui-org/react';
import { useImgGenerator } from '../hooks/useImgGenerator';
import { useMemo } from 'react';
import { extractParametersByTools } from '@/app/utils/tools';
import type { Message } from 'ai/react';

export function ImgItem(props: {
  aiAvatar?: string;
  aiName?: string;
  message: Message;
}) {
  const parameters = useMemo(
    () => extractParametersByTools(props.message?.content),
    [props.message],
  );

  const { data, error, isLoading } = useImgGenerator(
    parameters,
    props.message?.id,
  );

  return (
    <div className="flex">
      <Avatar
        src={props.aiAvatar!}
        className="mb-8 mr-4 w-8 h-8  text-large"
        name={props?.aiName!}
      />

      <div
        className={
          error
            ? `mr-auto bg-slate-50 text-red-600 rounded  px-4 py-2  max-w-[80%] mb-8`
            : `mr-auto bg-slate-50 text-black rounded  px-4 py-2 w-30 h-30`
        }
      >
        {isLoading && <CircularProgress label="图片生成中..." />}
        {error && <span>生成失败</span>}
        {data && (
          <Image
            isZoomed
            width={500}
            height={500}
            alt="Generated Image"
            src={data}
          />
        )}
      </div>
    </div>
  );
}
