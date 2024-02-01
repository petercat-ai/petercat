import { formatDuration } from '@/app/utils/audio';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import PlayIcon from '../icons/PlayIcon';
import { useAudioGenerator } from '../hooks/useAudioGenerator';
import { Spinner } from '@nextui-org/react';

interface AudioProps {
  voice?: string;
  message?: string;
}

interface AudioPlayerState {
  isPlaying: boolean;
  audioDuration: string;
  audio: HTMLAudioElement | null;
  currentTime: string;
  timer: NodeJS.Timer | null;
}

const AudioPlayer = (props: AudioProps) => {
  const { voice, message } = props;
  const {
    data: audioSrc,
    generateAudioByText,
    isLoading,
    error,
  } = useAudioGenerator();
  const [state, setState] = useImmer<AudioPlayerState>({
    isPlaying: false,
    audioDuration: '00:00',
    audio: null,
    currentTime: '00:00',
    timer: null,
  });
  const { isPlaying, audio, audioDuration, timer, currentTime } = state;

  const updateCurrentTime = () => {
    if (audio) {
      setState((draft) => {
        draft.currentTime = formatDuration(audio.currentTime);
      });
    }
  };

  const startTimer = () => {
    // 检查如果计时器已经运行则不再启动新的计时器
    const timer = setInterval(() => {
      updateCurrentTime();
    }, 1000);

    setState((draft) => {
      draft.timer = timer;
    });
  };

  const stopTimer = () => {
    if (timer) {
      clearInterval(timer);
    }
  };

  const handlePlayClick = async () => {
    if (!audioSrc) {
      generateAudioByText({
        input: message,
        voice,
      });
    }
    if (!audio) {
      const newAudio = new Audio(audioSrc);
      setState((draft) => {
        // @ts-ignore
        draft.audio = newAudio;
      });

      newAudio.onloadedmetadata = () => {
        setState((draft) => {
          draft.audioDuration = formatDuration(newAudio.duration);
        });
      };

      newAudio.onplay = () => {
        startTimer();
      };
      newAudio.onpause = newAudio.onended = () => {
        stopTimer();
      };

      await newAudio.play();
      setState((draft) => {
        draft.isPlaying = true;
      });
      newAudio.onended = () => {
        setState((draft) => {
          draft.isPlaying = false;
        });
      };
    } else {
      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }

      setState((draft) => {
        draft.isPlaying = !isPlaying;
      });
    }
  };
  const getUIState = () => {
    if (isLoading) {
      return <Spinner size="sm" />;
    }
    if (isPlaying) {
      return (
        <img
          src="https://mdn.alipayobjects.com/huamei_gjujqv/afts/img/A*1LRYSrX20PUAAAAAAAAAAAAADqHHAQ/original"
          alt="playing"
          className="w-[14px]"
        />
      );
    }
    return <PlayIcon />;
  };

  useEffect(() => {
    if (isPlaying && audio) {
      startTimer();
    }
    return () => {
      if (timer) {
        stopTimer();
      }
    };
  }, [isPlaying, audio]);

  if (error) {
    return <span className="text-red-600">Something error</span>;
  }

  return (
    <div className="w-full mt-2 pl-3">
      <div className="flex items-center justify-start space-x-2 text-xs">
        <button
          className={`w-[21px] h-[20px] rounded-full ${
            !isLoading ? 'bg-[#3e5cfa]' : ''
          } flex items-center justify-center
          `}
          onClick={handlePlayClick}
        >
          {getUIState()}
        </button>
        <span className="w-full text-slate-400">
          {currentTime} / {audioDuration}
        </span>
      </div>
    </div>
  );
};

export default AudioPlayer;
