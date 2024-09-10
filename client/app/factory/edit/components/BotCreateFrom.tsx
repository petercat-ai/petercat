import React, { ReactNode, useEffect, useMemo } from 'react';
import {
  Textarea,
  Input,
  Button,
  Avatar,
  Tooltip,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  SelectSection,
  Chip,
} from '@nextui-org/react';
import Collapse from './Collapse';
import { BotProfile } from '@/app/interface';
import InputList from './InputList';
import BulbIcon from '@/public/icons/BulbIcon';
import GitHubIcon from '@/public/icons/GitHubIcon';
import { random } from 'lodash';
import { useBotDelete } from '@/app/hooks/useBot';
import { ToastContainer, toast } from 'react-toastify';
import { useBot } from '@/app/contexts/BotContext';

import 'react-toastify/dist/ReactToastify.css';
import { AVATARS } from '@/app/constant/avatar';
import { useRouter } from 'next/navigation';
import { useAvaliableLLMs } from '@/app/hooks/useAvaliableLLMs';
import { useTokenList } from '@/app/hooks/useToken';
import CreateButton from '@/app/user/tokens/components/CreateButton';

const BotCreateFrom = () => {
  const { botProfile, setBotProfile } = useBot();
  const router = useRouter(); 
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { data: avaliableLLMs = [] } = useAvaliableLLMs();
  const { data: userTokens = [] } = useTokenList();

  const filteredTokens = useMemo(() => {
    if (botProfile.llm) {
      return userTokens.filter(t => t.llm === botProfile.llm);
    }
    return userTokens;
  }, [userTokens, botProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name as keyof Omit<BotProfile, 'starters'>;
    const value = e.target.value;
    setBotProfile((draft: BotProfile) => {
      // @ts-ignore
      draft[name] = value;
    });
  };

  const { deleteBot, isLoading, isSuccess, error } = useBotDelete();

  useEffect(() => {
    if (isSuccess) {
      toast.success('删除成功');
      onClose();
      setTimeout(() => {
        router.push('/factory/list');
      }, 1000);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      toast.error(`删除失败 ${error.message}`);
    }
  }, [error]);

  const handelDelete = () => {
    deleteBot(botProfile?.id!);
  };

  const customTitle = (
    <div className='flex'>
      <div className='flex-1 leading-8'>自定义</div>
      <div className='flex-0'>
        <CreateButton size="sm" variant="ghost" />
      </div>
    </div>
  ) as any;

  return (
    <div className="container mx-auto px-8 pt-8 pb-[45px] ">
      <form>
        <div className="flex items-center mb-6">
          <div className="mr-[48px] pl-4">
            <div>机器人头像*</div>
            <Avatar
              className="w-[80px] h-[80px] my-2 rounded-[16px] bg-gray-50"
              src={botProfile?.avatar}
              alt={botProfile?.name}
            />
            <div className="flex justify-between">
              <Tooltip content="随机头像">
                <Button
                  isIconOnly
                  onClick={() => {
                    setBotProfile((draft: BotProfile) => {
                      draft.avatar = AVATARS[random(0, 9)];
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
                  onClick={() => {
                    setBotProfile((draft: BotProfile) => {
                      draft.avatar = botProfile?.gitAvatar;
                    });
                  }}
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
        <Collapse title="大模型">
          <div className="flex items-center mb-6 gap-8">
            <div className="flex-1">
              <Select
                name="llm"
                label="选择大模型"
                isRequired
                variant='bordered'
                onChange={handleChange}
              >
                {avaliableLLMs.map(llm => <SelectItem key={llm}>{llm}</SelectItem>)}
              </Select>
            </div>
            <div className="flex-1">
              <Select
                name="token_id"
                label="选择 token"
                variant='bordered'
                onChange={handleChange}
                popoverProps={{style: { zIndex: 10 }}}
              >
                <SelectSection title="官方">
                  <SelectItem key="default">使用 petercat 提供的 token</SelectItem>
                </SelectSection>
                <SelectSection title={customTitle}>
                  {filteredTokens.map(t => <SelectItem key={t.id} textValue={t.slug!}>
                    <Chip color="default">{t.slug}</Chip>
                    {t.sanitized_token}
                  </SelectItem>)}
                </SelectSection>
              </Select>
            </div>
          </div>
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
          <label className="block text-sm font-medium text-gray-700 mt-4">
            开场白预置问题
            <InputList />
          </label>
        </Collapse>
        <Collapse title="危险操作">
          <Button
            color="danger"
            className="bg-[url('/images/delete.png')] h-[160px] w-[160px] bg-cover"
            rounded-lg
            onPress={onOpen}
          />
        </Collapse>
      </form>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                删除机器人
              </ModalHeader>
              <ModalBody>您真的忍心删除 {botProfile?.name} 吗？</ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button
                  isLoading={isLoading}
                  color="danger"
                  onPress={handelDelete}
                >
                  确认
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default BotCreateFrom;
