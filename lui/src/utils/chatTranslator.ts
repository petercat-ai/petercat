import { forEach } from 'lodash';
interface Tool {
  type: string;
  extra: {
    source: string;
    pluginName: string;
    data: string;
    status: string;
  };
}

export const convertChunkToJson = (rawData: string) => {
  const chunks = rawData?.trim()?.split('\n\n');
  const tools: Tool[] = [];
  const messages: string[] = [];

  try {
    forEach(chunks, (chunk) => {
      const regex = /data: (.*?})\s*$/;
      const match = chunk.match(regex);
      if (match && match[1]) {
        const parsedChunk = JSON.parse(match[1]);
        if (parsedChunk.type === 'tool') {
          tools.push(parsedChunk);
        } else if (parsedChunk.type === 'message') {
          messages.push(parsedChunk.content);
        }
      } else {
        messages.push(chunk);
      }
    });
    return { tools, message: messages.join('') };
  } catch (error) {
    return rawData;
  }
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
