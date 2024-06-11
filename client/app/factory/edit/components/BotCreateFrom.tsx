import React from 'react';
import { Textarea, Input, Button, Avatar, Tooltip } from '@nextui-org/react';
import Collapse from './Collapse';
import { BotProfile } from '@/app/interface';
import type { Updater } from 'use-immer';
import InputList from './InputList';
import BulbIcon from '@/public/icons/BulbIcon';
import GitHubIcon from '@/public/icons/GitHubIcon';
import { random } from 'lodash';

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
        <div className="flex items-center mb-6">
          <div className="mr-[48px] pl-4">
            <div>机器人头像*</div>
            <Avatar
              className="w-[80px] h-[80px] my-2 rounded-[16px]"
              src={botProfile?.avatar}
              alt={botProfile?.name}
            />
            <div className="flex justify-between">
              <Tooltip content="随机头像">
                <Button
                  isIconOnly
                  onClick={() => {
                    setBotProfile?.((draft: BotProfile) => {
                      draft.avatar = `/images/avatar${random(0, 9)}.png`;
                    });
                  }}
                  className="rounded-full bg-gray-700 mr-2 w-[32px] h-[32px]"
                  aria-label="随机头像"
                >
                  <BulbIcon />
                </Button>
              </Tooltip>

              <Tooltip content="GitHub 头像">
                <Button
                  isIconOnly
                  className="rounded-full bg-gray-700 w-[32px] h-[32px]"
                  aria-label="GitHub 头像"
                >
                  <GitHubIcon />
                </Button>
              </Tooltip>
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-[42px]">
              <Input
                name="name"
                label="机器人名称*"
                variant="bordered"
                labelPlacement="outside"
                value={botProfile?.name}
                onChange={handleChange}
                placeholder="给机器人起一个独一无二的名字"
                required
              />
            </div>
            <div className="mt-[42px]">
              <Input
                name="description"
                label="机器人描述*"
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
