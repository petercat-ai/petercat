/* generate img from prompt */
export async function generateImgByPrompt(params: { prompt: string }) {
  return fetch('/api/chat/image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
}
