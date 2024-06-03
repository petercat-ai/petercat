import React, { useEffect, useState } from 'react';
import { Textarea, Input, Image, Button, Avatar } from '@nextui-org/react';
import ImageUploadComponent from './ImageUpload';
import Collapse from './Collapse';
import { BotProfile } from '@/app/interface';
import type { Updater } from 'use-immer';
import InputList from './InputList';

interface BotFormProps {
  botProfile?: BotProfile;
  setBotProfile?: Updater<BotProfile>;
}

const BotCreateFrom = (props: BotFormProps) => {
  const { botProfile, setBotProfile } = props;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof Omit<BotProfile, 'starters'>;
    const value = e.target.value;
    setBotProfile?.((draft: BotProfile) => {
      // @ts-ignore
      draft[name] = value;
    });
  };

  return (
    <div className="container mx-auto p-8">
      <form>
        <div className="px-[46px]">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-10">
              <Avatar
                radius="sm"
                icon={<img src="/path-to-default-avatar.png" alt="Avatar" />}
              />
            </div>
            <div className="flex-1">
              <Input
                name="name"
                label="机器人名称"
                variant="bordered"
                labelPlacement="outside"
                value={botProfile?.name}
                onChange={handleChange}
                placeholder="给机器人起一个独一无二的名字"
                required
              />
              <Input
                name="description"
                label="机器人描述"
                variant="bordered"
                labelPlacement="outside"
                value={botProfile?.description}
                onChange={handleChange}
                placeholder="简单描述机器人的用途"
                required
              />
            </div>
          </div>
        </div>
        {/* <div>
          <Input
            type="text"
            variant="bordered"
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
          variant="bordered"
          name="description"
          label="Description"
          placeholder="Description  about your bot"
          labelPlacement="outside"
          value={botProfile?.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        /> */}
        <Collapse title="人设与回复逻辑">
          <Textarea
            name="prompt"
            variant="bordered"
            value={botProfile?.prompt}
            disableAutosize
            onChange={handleChange}
            required
            classNames={{
              input: 'resize-y min-h-[216px]',
            }}
          />
        </Collapse>
        <Collapse title="开场白">
          <Input
            name="helloMessage"
            label="开场白文案"
            variant="bordered"
            labelPlacement="outside"
            value={botProfile?.helloMessage}
            onChange={handleChange}
            placeholder="输入开场文案"
            required
          />
          <label className="block text-sm font-medium text-gray-700 mt-2">
            开场白预置问题
            <InputList botProfile={botProfile} setBotProfile={setBotProfile} />
          </label>
        </Collapse>
        <Collapse title="危险操作">
          <Button
            color="danger"
            className="bg-[url('/images/delete.png')] h-[160px] w-[160px] bg-cover"
            rounded-lg
          />
        </Collapse>
      </form>
    </div>
  );
};

export default BotCreateFrom;
