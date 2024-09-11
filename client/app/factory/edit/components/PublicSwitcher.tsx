import I18N from '@/app/utils/I18N';
import React, { useEffect, useState } from 'react';
import { Switch, cn } from '@nextui-org/react';
import type { Updater } from 'use-immer';
import { BotProfile } from '@/app/interface';

interface PublicSwitcherProps {
  isSelected: boolean;
  setBotProfile?: Updater<BotProfile>;
}

const PublicSwitcher = (props: PublicSwitcherProps) => {
  const { isSelected, setBotProfile } = props;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;

    setBotProfile?.((draft: BotProfile) => {
      draft.public = value;
    });
  };

  return (
    <Switch
      isSelected={isSelected}
      classNames={{
        wrapper: cn("w-[22px] h-[14px] bg-gray-400 p-[2px]",
          //selected
          "group-data-[selected=true]:bg-gray-800",
          "group-data-[selected=true]:w-[22px]",
          "group-data-[selected=true]:h-[14px]",
        ),
        thumb: cn("w-[10px] h-[10px]",
          //selected
          "group-data-[selected=true]:w-[10px]",
          "group-data-[selected=true]:h-[10px]",
          "group-data-[selected=true]:ml-[8px]"

        )
      }}
      onChange={onChange}
    >
      {I18N.components.PublicSwitcher.shiChangZhongGongKai}</Switch>
  );
};

export default PublicSwitcher;
