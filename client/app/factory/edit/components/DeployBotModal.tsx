'use client';
import I18N from '@/app/utils/I18N';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  useDisclosure,
  Tooltip,
  Checkbox,
  Input,
  Listbox,
  ListboxItem,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useBotDelete, useGetBotRagTask } from '@/app/hooks/useBot';
import CloudIcon from '@/public/icons/CloudIcon';
import LoadingIcon from '@/public/icons/LoadingIcon';
import { Bot, RagTask } from '@/app/services/BotsController';
import { useBot } from '@/app/contexts/BotContext';
import SaveSuccessIcon from '@/public/icons/SaveSuccessIcon';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IDeployItemProps {
  checked: boolean;
  key: string;
  title: React.ReactNode;
  canHide: boolean;
  subTitle?: string;
  defaultSelected: boolean;
  /** children 是否默认隐藏 */
  defaultIsHide: boolean;
  onChange: (key: string, checked: boolean) => void;
  children: React.ReactNode;
}

const DeployItem: React.FC<IDeployItemProps> = ({
  key,
  checked,
  onChange,
  title,
  subTitle,
  canHide,
  children,
  defaultIsHide,
}) => {
  const [isChildrenHide, setIsChildrenHide] = useState(defaultIsHide);
  return (
    <div className="flex flex-col border border-gray-300 p-[16px] rounded-[8px]">
      <div className="flex justify-between items-center">
        <span className="text-[14px]">
          <Checkbox
            color="default"
            onValueChange={(isSelected) => {
              onChange(key, isSelected);
            }}
            isSelected={checked}
          />
          <span className="font-sans font-semibold">{title}</span>
        </span>
        {canHide && (
          <span className="cursor-pointer text-gray-500 text-[14px]">
            {isChildrenHide ? (
              <span
                onClick={() => {
                  if (canHide) {
                    setIsChildrenHide(false);
                  }
                }}
              >
                {subTitle}
              </span>
            ) : (
              <span
                onClick={() => {
                  setIsChildrenHide(true);
                }}
              >
                收起
              </span>
            )}
          </span>
        )}
      </div>
      <div
        style={{
          overflow: 'hidden',
          transition: 'all 0.3s linear(0 0%, 0.09 25%, 1 100%)',
          maxHeight: 0,
          opacity: 0,
          display: 'block',
          ...(!isChildrenHide && {
            marginTop: '16px',
            maxHeight: '300px',
            opacity: 1,
            overflow: 'auto',
          }),
        }}
      >
        {children}
      </div>
    </div>
  );
};

const DeployBotModal: React.FC<IProps> = ({ isOpen, onClose }) => {
  const { botProfile, setBotProfile } = useBot();
  // TODO:获取当前机器人的公布到市场的状态
  // TODO:获取部署信息
  const [deploy, setDeploy] = useState({});
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(['text']));

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(', '),
    [selectedKeys],
  );

  const handleOK = () => {};

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} hideCloseButton={true}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex justify-center items-center gap-2 h-[40px]">
                  <span className="mt-[28px]">
                    <SaveSuccessIcon />
                  </span>
                  <span>保存成功！</span>
                </div>
              </ModalHeader>
              <ModalBody className="py-[0px]">
                <DeployItem
                  canHide={false}
                  defaultSelected={true}
                  defaultIsHide={true}
                  checked={true}
                  key={'market_issue'}
                  title="公开到 Peter Cat 市场"
                  onChange={(key, checked) => {
                    setDeploy({ ...deploy, [key]: checked });
                  }}
                >
                  <span className="text-gray-500 text-[14px]">
                    这将提交一个 issue 到 Peter Cat
                    仓库，待我们人工审核通过后即可完成公开
                  </span>
                </DeployItem>
                <DeployItem
                  canHide={true}
                  defaultSelected={true}
                  defaultIsHide={true}
                  checked={true}
                  key={'website'}
                  title="部署到我的网站"
                  subTitle="点击开始配置"
                  onChange={(key, checked) => {
                    setDeploy({ ...deploy, [key]: checked });
                  }}
                >
                  <Input
                    type="url"
                    label={
                      <span className="font-sans text-[14px] font-semibold leading-[20px] text-left">
                        目标网站域名
                      </span>
                    }
                    placeholder=""
                    labelPlacement="outside"
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">
                          https://
                        </span>
                      </div>
                    }
                  />
                </DeployItem>
                <DeployItem
                  canHide={true}
                  defaultSelected={true}
                  defaultIsHide={true}
                  checked={true}
                  key={'github'}
                  title="选择要关联的 GitHub 仓库"
                  subTitle="点击开始配置"
                  onChange={(key, checked) => {
                    setDeploy({ ...deploy, [key]: checked });
                  }}
                >
                  <Listbox
                    aria-label="Multiple selection example"
                    variant="flat"
                    disallowEmptySelection
                    selectionMode="multiple"
                    selectedKeys={selectedKeys}
                    // @ts-ignore
                    onSelectionChange={setSelectedKeys}
                  >
                    <ListboxItem key="text">Text</ListboxItem>
                    <ListboxItem key="number">Number</ListboxItem>
                    <ListboxItem key="date">Date</ListboxItem>
                    <ListboxItem key="single_date">Single Date</ListboxItem>
                    <ListboxItem key="iteration">Iteration</ListboxItem>
                  </Listbox>
                </DeployItem>
              </ModalBody>
              <ModalFooter className="flex justify-center items-center">
                <Button
                  className="border-[1.5px] border-[#3F3F46] rounded-[46px]"
                  variant="light"
                  onPress={() => onClose()}
                >
                  跳过
                </Button>
                <Button
                  isDisabled
                  className="border-[1.5px] border-[#3F3F46] rounded-[46px] bg-[#3F3F46] text-white"
                  onPress={() => setDeploy({})}
                >
                  确认
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeployBotModal;
