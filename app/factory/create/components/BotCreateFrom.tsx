import { Textarea, Input } from '@nextui-org/react';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import ImageUploadComponent from './ImageUpload';
import InputList from './InputList';
import { toast } from 'react-toastify';
import { BotProfile } from '../interface';
import { useBot } from '../hooks/useBot';

export interface BotFormRef {
  submit: (e: any) => Promise<void>;
  resetFields: () => void;
}

interface BotFormProps {
  formRef?: React.MutableRefObject<BotFormRef | undefined>;
}

const BotCreateFrom: React.FC<BotFormProps> = forwardRef(({ formRef }, ref) => {
  const { onCreateBot, createBotLoading } = useBot();
  const [profile, setProfile] = useState<BotProfile>({
    avatar: '',
    name: 'Untitled',
    description: '',
    prompt: '',
    starter: [],
  });
  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: files ? files[0] : value,
    }));
  };

  const updateAvatar = (src: string) => {
    console.log('src', src);
    setProfile((prevProfile) => ({
      ...prevProfile,
      avatar: src,
    }));
  };

  const resetFields = useCallback(() => {
    setProfile({
      avatar: '',
      name: 'Untitled',
      description: '',
      prompt: '',
      starter: [],
    });
  }, []);

  const submit = async (e: any) => {
    toast.info('Submit success');
    e.preventDefault();

    try {
      const response = await onCreateBot(profile);
      if (response.ok) {
        await response.json();
        toast.success('Save success');
      } else {
        toast.error('Save failed');
      }
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Save failed');
    }
  };

  useImperativeHandle(formRef, () => {
    return {
      submit,
      resetFields,
    };
  });

  return (
    <div className="container mx-auto p-8">
      <form className="space-y-8" onSubmit={submit}>
        <ImageUploadComponent
          avatar={profile.avatar}
          updateAvatar={updateAvatar}
        />
        <div>
          <Input
            type="text"
            name="name"
            label="Name"
            placeholder="Name your bot"
            labelPlacement="outside"
            value={profile.name}
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
          value={profile.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <Textarea
          name="prompt"
          label="Instructions"
          labelPlacement="outside"
          value={profile.prompt}
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
});

export default BotCreateFrom;
