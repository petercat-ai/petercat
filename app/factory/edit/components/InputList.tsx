import React, { useEffect, useState } from 'react';
import type { Updater } from 'use-immer';
import { BotProfile } from '@/interface';

const MAX_INPUTS = 4; // Max number of inputs

interface InputListProps {
  botProfile?: BotProfile;
  setBotProfile?: Updater<BotProfile>;
}

const InputList = (props: InputListProps) => {
  const { botProfile, setBotProfile } = props;
  const [inputs, setInputs] = useState(['']);

  useEffect(() => {
    if (botProfile?.starters) {
      setInputs(botProfile?.starters);
    }
  }, [botProfile?.starters]);

  const handleChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
    setBotProfile?.((draft: BotProfile) => {
      draft.starters = newInputs;
    });
    if (index === inputs.length - 1 && value && inputs.length < MAX_INPUTS) {
      setInputs([...newInputs, '']);
    }
  };
  const handleRemove = (index: number) => {
    if (inputs.length === 1) {
      return;
    }
    const newInputs = inputs.filter((_, idx) => idx !== index);
    setInputs(newInputs);
    setBotProfile?.((draft: BotProfile) => {
      draft.starters = newInputs;
    });
  };

  return (
    <>
      {inputs.map((input, index) => (
        <div key={index} className="flex items-center mb-2">
          <input
            type="text"
            value={input}
            onChange={(e) => handleChange(index, e.target.value)}
            className={`w-full resize-none overflow-y-auto rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 border focus:ring-blue-400 border-token-border-medium h-9 dark:bg-gray-800 ${
              inputs.length > 1 ? 'rounded-r-none' : ''
            }`}
          />
          {inputs.length > 1 && (
            <button
              onClick={() => handleRemove(index)}
              className="flex h-9 w-9 items-center justify-center rounded-lg rounded-l-none border border-l-0 border-token-border-medium"
            >
              &#10005;
            </button>
          )}
        </div>
      ))}
    </>
  );
};

export default InputList;
