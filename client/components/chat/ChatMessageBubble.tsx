import { Avatar } from '@nextui-org/react';
import type { Message } from 'ai/react';
import AudioPlayer from './AudioPlayer';

export function ChatMessageBubble(props: {
  message: Message;
  sources: any[];
  aiAvatar?: string;
  aiName?: string;
  voice?: string;
}) {
  const { voice = null } = props;
  const colorClassName =
    props.message.role === 'user' ? 'bg-[#d2e3fc]' : 'bg-slate-50 text-black';
  const alignmentClassName =
    props.message.role === 'user' ? 'ml-auto' : 'mr-auto';
  const isBot = props.message.role === 'user' ? false : true;
  return (
    <div className="flex">
      {isBot && (
        <Avatar
          src={props?.aiAvatar!}
          className="mb-8 mr-4 w-8 h-8  text-large"
          name={props?.aiName!}
        />
      )}
      <div
        className={`${alignmentClassName} ${colorClassName} rounded  px-4 py-2 max-w-[80%] mb-8 flex`}
      >
        <div className="whitespace-pre-wrap flex flex-col">
          <span>{props.message.content}</span>
          {voice && isBot && (
            <AudioPlayer voice={voice} message={props.message.content} />
          )}
        </div>
      </div>
    </div>
  );
}
