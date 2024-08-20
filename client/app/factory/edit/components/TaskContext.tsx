import React, { createContext, useContext } from 'react';
import { Updater, useImmer } from 'use-immer';

interface TaskContext {
  running: boolean;
}
const DefaultTaskContext: TaskContext = {
  running: true,
};

const BotTaskContext = createContext<
  | {
      taskProfile: TaskContext;
      setTaskProfile: Updater<TaskContext>;
    }
  | undefined
>(undefined);

const BotTaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [taskProfile, setTaskProfile] =
    useImmer<TaskContext>(DefaultTaskContext);

  return (
    <BotTaskContext.Provider value={{ taskProfile, setTaskProfile }}>
      {children}
    </BotTaskContext.Provider>
  );
};

const useBotTask = () => {
  const context = useContext(BotTaskContext);
  if (context === undefined) {
    throw new Error('useBotTask must be used within a BotTaskProvider');
  }
  return context;
};

export { BotTaskProvider, useBotTask };
