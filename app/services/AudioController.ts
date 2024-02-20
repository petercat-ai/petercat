import axios from 'axios';

interface GenerateAudioRespose {
  data: {
    realPath: string;
  };
}

/* generate audio from input */
export async function generateAudioByText(params: {
  input?: string;
  voice?: string;
}): Promise<GenerateAudioRespose> {
  return axios.post('/api/chat/audio', params);
}
