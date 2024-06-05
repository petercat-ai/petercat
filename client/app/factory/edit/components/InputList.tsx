import React, { useEffect, useState } from 'react';
import type { Updater } from 'use-immer';
import { BotProfile } from '@/app/interface';
import { Button, Input } from '@nextui-org/react';
import MinusIcon from '@/public/icons/MinusIcon';

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
          <Input
            variant="bordered"
            labelPlacement="outside"
            value={input}
            placeholder="输入开场白引导问题"
            onChange={(e) => handleChange(index, e.target.value)}
            className="mb-2"
            endContent={
              inputs.length > 1 && (
                <Button
                  onClick={() => handleRemove(index)}
                  isIconOnly
                  className="min-w-[16px] rounded-full bg-red-500 w-[16px] h-[16px] text-white"
                  aria-label="删除"
                >
                  <MinusIcon />
                </Button>
              )
            }
          />
        </div>
      ))}
    </>
  );
};

export default InputList;
