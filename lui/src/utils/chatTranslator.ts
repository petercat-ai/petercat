const convertChunkToJson = (rawData: string) => {
  const regex = /data: (.*?})\s*$/;
  const match = rawData.match(regex);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (e) {
      console.error('Parsing error:', e);
      return null;
    }
  } else {
    console.error('No valid JSON found in input');
    return null;
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
            const chunk = decoder.decode(value, { stream: true });
            const message = convertChunkToJson(chunk);

            controller.enqueue(encoder.encode(message.data));
            push();
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
