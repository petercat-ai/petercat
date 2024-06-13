import React, { createContext, useContext } from 'react';
import { Updater, useImmer } from 'use-immer';
import { BotProfile } from '@/app/interface';

export const defaultBotProfile: BotProfile = {
  id: '',
  avatar: '',
  gitAvatar: '',
  name: 'Untitled',
  description: '',
  prompt: '',
  starters: [''],
  public: false,
  repoName: '',
  helloMessage: '',
};

const BotContext = createContext<
  | {
      botProfile: BotProfile;
      setBotProfile: Updater<BotProfile>;
    }
  | undefined
>(undefined);

const BotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [botProfile, setBotProfile] = useImmer<BotProfile>(defaultBotProfile);

  return (
    <BotContext.Provider value={{ botProfile, setBotProfile }}>
      {children}
    </BotContext.Provider>
  );
};

const useBot = () => {
  const context = useContext(BotContext);
  if (context === undefined) {
    throw new Error('useBot must be used within a BotProvider');
  }
  return context;
};

export { BotProvider, useBot };
