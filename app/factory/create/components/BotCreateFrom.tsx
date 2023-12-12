import { Textarea, Input } from '@nextui-org/react';
import { useEffect } from 'react';
import ImageUploadComponent from './ImageUpload';
import InputList from './InputList';
import { BotProfile } from '../interface';
import type { Updater } from 'use-immer';

interface BotFormProps {
  botProfile?: BotProfile;
  setBotProfile?: Updater<BotProfile>;
}

const BotCreateFrom = (props: BotFormProps) => {
  const { botProfile, setBotProfile } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof Omit<BotProfile, 'starter'>;
    const value = e.target.value;
    setBotProfile?.((draft: BotProfile) => {
      draft[name] = value;
    });
  };

  useEffect(() => {
    console.log('botProfile', botProfile);
  }, [botProfile]);
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
          <InputList />
        </label>
      </form>
    </div>
  );
};

export default BotCreateFrom;
