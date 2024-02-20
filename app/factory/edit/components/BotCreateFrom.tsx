import React, { useEffect, useState } from 'react';
import { Textarea, Input, Checkbox, Switch, cn } from '@nextui-org/react';
import ImageUploadComponent from './ImageUpload';
import { BotProfile } from '@/interface';
import type { Updater } from 'use-immer';
import InputList from './InputList';
import VoiceSelector from './VoiceSelector';

interface BotFormProps {
  botProfile?: BotProfile;
  setBotProfile?: Updater<BotProfile>;
}

const BotCreateFrom = (props: BotFormProps) => {
  const { botProfile, setBotProfile } = props;
  const [enableVoice, setEnableVoice] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof Omit<
      BotProfile,
      'starters' | 'enable_img_generation'
    >;
    const value = e.target.value;
    setBotProfile?.((draft: BotProfile) => {
      draft[name] = value;
    });
  };

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setBotProfile?.((draft: BotProfile) => {
      draft.enable_img_generation = value;
    });
  };

  useEffect(() => {
    if (botProfile?.voice) {
      setEnableVoice(true);
    }
  }, [botProfile?.voice]);

  return (
    <div className="container mx-auto p-8">
      <form className="space-y-8">
        <ImageUploadComponent
          botProfile={botProfile}
          setBotProfile={setBotProfile}
        />
        <div>
          <Input
            type="text"
            name="name"
            label="Name"
            placeholder="Name your bot"
            labelPlacement="outside"
            value={botProfile?.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mb-4"
          />
        </div>
        <Input
          type="text"
          name="description"
          label="Description"
          placeholder="Description  about your bot"
          labelPlacement="outside"
          value={botProfile?.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <Textarea
          name="prompt"
          label="Instructions"
          labelPlacement="outside"
          value={botProfile?.prompt}
          disableAutosize
          onChange={handleChange}
          placeholder="What does your bot do? How does it behave? What should it avoid doing?"
          required
          classNames={{
            input: 'resize-y min-h-[120px]',
          }}
        />
        <label className="block text-sm font-medium text-gray-700">
          Conversation starters
          <InputList botProfile={botProfile} setBotProfile={setBotProfile} />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Capabilities
          <Checkbox
            className="block"
            name="enable_img_generation"
            size="sm"
            onChange={handleCheck}
            isSelected={botProfile?.enable_img_generation}
          >
            DALL·E Image Generation
          </Checkbox>
        </label>
        <Switch
          isSelected={enableVoice}
          onValueChange={(isSeleted: boolean) => setEnableVoice(isSeleted)}
          classNames={{
            base: cn(
              'inline-flex flex-row-reverse w-full hover:bg-content2 items-center',
              'justify-between cursor-pointer rounded-lg gap-[8rem] p-4 border-2 border-transparent',
              'data-[selected=true]:border-primary',
            ),
            wrapper: 'p-0 h-4 overflow-visible',
            thumb: cn(
              'w-6 h-6 border-2 shadow-lg',
              'group-data-[hover=true]:border-primary',
              //selected
              'group-data-[selected=true]:ml-6',
              // pressed
              'group-data-[pressed=true]:w-7',
              'group-data-[selected]:group-data-[pressed]:ml-4',
            ),
          }}
        >
          <div className="flex flex-col">
            <span className="text-medium">Enable Voice</span>
            <span className="text-tiny text-default-400">
              After turning on this option, your bot can send voice messages to
              you
            </span>
          </div>
        </Switch>
        {enableVoice && (
          <VoiceSelector
            botProfile={botProfile}
            setBotProfile={setBotProfile}
          />
        )}
      </form>
    </div>
  );
};

export default BotCreateFrom;
