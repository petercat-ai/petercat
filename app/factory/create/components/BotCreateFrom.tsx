import { Textarea, Input } from '@nextui-org/react';
import { useState } from 'react';
import ImageUploadComponent from './ImageUpload';
import InputList from './InputList';
const BotCreateFrom = () => {
  const [profile, setProfile] = useState({
    avatar: null,
    name: '',
    bio: '',
    info: '',
  });
  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // 这里可以添加将表单数据发送到服务器的逻辑，例如使用 fetch API。
    console.log(profile);
  };

  return (
    <div className="container mx-auto p-8">
      <form className="space-y-8" onSubmit={handleSubmit}>
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
          name="name"
          label="Description"
          placeholder="Description  about your bot"
          labelPlacement="outside"
          value={profile.info}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <Textarea
          name="bio"
          label="Instructions"
          labelPlacement="outside"
          value={profile.bio}
          disableAutosize
          onChange={handleChange}
          placeholder="What does your bot do? How does it behave? What should it avoid doing?"
          required
          classNames={{
            input: 'resize min-h-[520px]',
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
