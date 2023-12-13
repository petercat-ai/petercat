import { Textarea, Input } from '@nextui-org/react';
import { useEffect, useMemo } from 'react';
import ImageUploadComponent from './ImageUpload';
import { BotProfile } from '../interface';
import type { Updater } from 'use-immer';

interface BotFormProps {
  botProfile?: BotProfile;
  setBotProfile?: Updater<BotProfile>;
}

const MAX_INPUTS = 4; // Max number of starters

const BotCreateFrom = (props: BotFormProps) => {
  const { botProfile, setBotProfile } = props;
  const starters = useMemo(() => botProfile?.starters || [''], [botProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof Omit<BotProfile, 'starters'>;
    const value = e.target.value;
    setBotProfile?.((draft: BotProfile) => {
      draft[name] = value;
    });
  };

  const InputList = () => {
    const handleChange = (index: number, value: string) => {
      const newStarters = [...starters];
      newStarters[index] = value;
      setBotProfile?.((draft: BotProfile) => {
        draft.starters = newStarters;
      });

      if (
        index === starters.length - 1 &&
        value &&
        starters.length < MAX_INPUTS
      ) {
        setBotProfile?.((draft: BotProfile) => {
          draft.starters = [...newStarters, ''];
        });
      }
    };
    const handleRemove = (index: number) => {
      const newStarters = starters.filter((_, idx) => idx !== index);
      setBotProfile?.((draft: BotProfile) => {
        draft.starters = newStarters;
      });
    };

    useEffect(() => {
      console.log('botProfile', botProfile);
    }, [starters]);

    return (
      <>
        {starters.map((input, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={input}
              onChange={(e) => handleChange(index, e.target.value)}
              className="w-full resize-none overflow-y-auto rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 border focus:ring-blue-400 border-token-border-medium h-9 dark:bg-gray-800 rounded-r-none"
            />
            <button
              onClick={() => handleRemove(index)}
              className="flex h-9 w-9 items-center justify-center rounded-lg rounded-l-none border border-l-0 border-token-border-medium"
            >
              &#10005;
            </button>
          </div>
        ))}
      </>
    );
  };

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
          Conversation starterss
          <InputList />
        </label>
      </form>
    </div>
  );
};

export default BotCreateFrom;
