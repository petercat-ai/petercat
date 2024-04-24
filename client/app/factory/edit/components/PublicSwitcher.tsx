import React, { useEffect, useState } from 'react';
import { Switch } from '@nextui-org/react';
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
      color="success"
      size="sm"
      onChange={onChange}
    >
      Public
    </Switch>
  );
};

export default PublicSwitcher;
