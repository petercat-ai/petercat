import { Textarea, Input } from '@nextui-org/react';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import ImageUploadComponent from './ImageUpload';
import InputList from './InputList';
import { toast } from 'react-toastify';

export interface BotFormRef {
  submit: (e: any) => Promise<void>;
  resetFields: () => void;
}

interface BotFormProps {
  formRef?: React.MutableRefObject<BotFormRef | undefined>;
}

const BotCreateFrom: React.FC<BotFormProps> = forwardRef(({ formRef }) => {
  const [profile, setProfile] = useState({
    avatar: null,
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
  const resetFields = useCallback(() => {
    setProfile({
      avatar: null,
      name: 'Untitled',
      description: '',
      prompt: '',
      starter: [],
    });
  }, []);

  const submit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/bot/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });
      console.log(response);

      if (response.ok) {
        await response.json();
        toast('Save success');
      } else {
        toast('Save failed');
      }
    } catch (error) {
      console.error('Save failed:', error);
      toast('Save failed');
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
        <ImageUploadComponent />
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
