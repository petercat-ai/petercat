'use client';
import { Avatar, CircularProgress } from '@nextui-org/react';

export function ToolsCheck(props: { aiAvatar?: string; aiName?: string }) {
  return (
    <div className="flex">
      <Avatar
        src={props.aiAvatar!}
        className="mb-8 mr-4 w-8 h-8  text-large"
        name={props?.aiName!}
      />

      <div
        className={`mr-auto bg-slate-50 text-black rounded  px-4 py-2 max-w-[80%] mb-8 flex`}
      >
        <div className="mr-auto bg-slate-50 text-black rounded  p-2 w-30 h-30">
          <CircularProgress label="🔍 Tools Checking ..." />
        </div>
      </div>
    </div>
  );
}
