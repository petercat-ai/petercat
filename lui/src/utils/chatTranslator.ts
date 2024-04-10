import { map } from 'lodash';
import { Role } from '../interface';

export const convertChunkToJson = (rawData: string) => {
  const regex = /data:(.*)/;
  const match = rawData.match(regex);
  if (match && match[1]) {
    try {
      const res = JSON.parse(match[1]);
      if (res?.role === Role.assistant) {
        return res?.content;
      } else if (res?.role === Role.tool) {
        return JSON.stringify(res);
      }
    } catch (e) {
      console.error('Parsing error:', e);
      return null;
    }
  } else {
    console.error('No valid JSON found in input');
    return null;
  }
};

export const chunkFormatter = (chunk: string) => {
  const dataLines = chunk.split('\n');
  return map(dataLines, (item: string) => convertChunkToJson(item));
};

export const handleStream = async (response: Response) => {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder('utf-8');
  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      function push() {
        reader
          .read()
          .then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            if (value) {
              const chunk = decoder.decode(value, { stream: true });
              controller.enqueue(encoder.encode(chunk));
              push();
            }
          })
          .catch((err) => {
            console.error('读取流中的数据时发生错误', err);
            controller.error(err);
          });
      }
      push();
    },
  });
  return new Response(readableStream);
};
