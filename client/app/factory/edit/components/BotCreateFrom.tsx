'use client';
import I18N from '@/app/utils/I18N';
import React, { useEffect, useMemo } from 'react';
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
      return userTokens.filter((t) => t.llm === botProfile.llm);
    }
    return userTokens;
  }, [userTokens, botProfile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
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
      toast.success(I18N.components.BotCreateFrom.shanChuChengGong);
      onClose();
      setTimeout(() => {
        router.push('/factory/list');
      }, 1000);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      toast.error(
        I18N.template(I18N.components.BotCreateFrom.shanChuShiBaiE, {
          val1: error.message,
        }),
      );
    }
  }, [error]);

  const handelDelete = () => {
    deleteBot(botProfile?.id!);
  };

  const customTitle = (
    <div className="flex">
      <div className="flex-1 leading-8">
        {I18N.components.BotCreateFrom.ziDingYi}
      </div>
      <div className="flex-0">
        <CreateButton size="sm" variant="ghost" />
      </div>
    </div>
  ) as any;

  return (
    <div className="container mx-auto px-8 pt-8 pb-[45px] ">
      <form>
        <div className="flex items-center mb-6">
          <div className="mr-[48px] pl-4">
            <div>{I18N.components.BotCreateFrom.jiQiRenTouXiang}</div>
            <Avatar
              className="w-[80px] h-[80px] my-2 rounded-[16px] bg-gray-50"
              src={botProfile?.avatar}
              alt={botProfile?.name}
            />
            <div className="flex justify-between">
              <Tooltip content={I18N.components.BotCreateFrom.suiJiTouXiang}>
                <Button
                  isIconOnly
                  onClick={() => {
                    setBotProfile((draft: BotProfile) => {
                      draft.avatar = AVATARS[random(0, 9)];
                    });
                  }}
                  className="rounded-full bg-gray-700 mr-2 w-[32px] h-[32px]"
                  aria-label={I18N.components.BotCreateFrom.suiJiTouXiang}
                >
                  <BulbIcon />
                </Button>
              </Tooltip>

              <Tooltip content={I18N.components.BotCreateFrom.gITHU}>
                <Button
                  isIconOnly
                  className="rounded-full bg-gray-700 w-[32px] h-[32px]"
                  aria-label={I18N.components.BotCreateFrom.gITHU}
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
                label={I18N.components.BotCreateFrom.jiQiRenMingCheng}
                variant="bordered"
                labelPlacement="outside"
                value={botProfile?.name}
                onChange={handleChange}
                placeholder={I18N.components.BotCreateFrom.geiJiQiRenQi}
                required
              />
            </div>
            <div className="mt-[42px]">
              <Input
                name="description"
                label={I18N.components.BotCreateFrom.jiQiRenMiaoShu}
                variant="bordered"
                labelPlacement="outside"
                value={botProfile?.description}
                onChange={handleChange}
                placeholder={I18N.components.BotCreateFrom.jianDanMiaoShuJi}
                required
              />
            </div>
          </div>
        </div>
        <Collapse title={I18N.components.BotCreateFrom.renSheYuHuiFu}>
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
        <Collapse title={I18N.components.BotCreateFrom.daMoXing}>
          <div className="flex items-center mb-6 gap-8">
            <div className="flex-1">
              <Select
                name="llm"
                label={I18N.components.BotCreateFrom.xuanZeDaMoXing}
                isRequired
                variant="bordered"
                onChange={handleChange}
              >
                {avaliableLLMs.map((llm) => (
                  <SelectItem key={llm}>{llm}</SelectItem>
                ))}
              </Select>
            </div>
            <div className="flex-1">
              <Select
                name="token_id"
                label={I18N.components.BotCreateFrom.xuanZeTOK}
                variant="bordered"
                onChange={handleChange}
                popoverProps={{ style: { zIndex: 10 } }}
              >
                <SelectSection title={I18N.components.BotCreateFrom.guanFang}>
                  <SelectItem key="default">
                    {I18N.components.BotCreateFrom.shiYongPET}
                  </SelectItem>
                </SelectSection>
                <SelectSection title={customTitle}>
                  {filteredTokens.map((t) => (
                    <SelectItem key={t.id} textValue={t.slug!}>
                      <Chip color="default">{t.slug}</Chip>
                      {t.sanitized_token}
                    </SelectItem>
                  ))}
                </SelectSection>
              </Select>
            </div>
          </div>
        </Collapse>
        <Collapse title={I18N.components.BotCreateFrom.kaiChangBai}>
          <Input
            name="helloMessage"
            label={I18N.components.BotCreateFrom.kaiChangBaiWenAn}
            variant="bordered"
            labelPlacement="outside"
            value={botProfile?.helloMessage}
            onChange={handleChange}
            placeholder={I18N.components.BotCreateFrom.shuRuKaiChangWen}
            required
          />
          <label className="block text-sm font-medium text-gray-700 mt-4">
            {I18N.components.BotCreateFrom.kaiChangBaiYuZhi}
            <InputList />
          </label>
        </Collapse>
        <Collapse title={I18N.components.BotCreateFrom.weiXianCaoZuo}>
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
                {I18N.components.BotCreateFrom.shanChuJiQiRen}
              </ModalHeader>
              <ModalBody>
                {I18N.components.BotCreateFrom.ninZhenDeRenXin}
                {botProfile?.name} {I18N.components.BotCreateFrom.ma}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  {I18N.components.BotCreateFrom.quXiao}
                </Button>
                <Button
                  isLoading={isLoading}
                  color="danger"
                  onPress={handelDelete}
                >
                  {I18N.components.BotCreateFrom.queRen}
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
