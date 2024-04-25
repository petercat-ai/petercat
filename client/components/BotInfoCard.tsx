import { Tables } from '@/types/database.types';
import { Avatar, Chip, Skeleton } from '@nextui-org/react';
import { Dispatch, SetStateAction } from 'react';
import { map } from 'lodash';

interface BotInfoCardProps {
  avatar?: string;
  description?: string;
  name?: string;
  starters?: string[];
  loading?: boolean;
  setInput?: Dispatch<SetStateAction<string>>;
}

const BotInfoCard = (props: BotInfoCardProps) => {
  const { setInput } = props;
  return (
    <div className="p-2 md:p-4  w-full h-screen overflow-hidden relative">
      <div className="w-full flex justify-center items-center">
        <Avatar
          src={props?.avatar!}
          className="h-24 w-24 text-large mb-2"
          name={props?.name!}
        />
      </div>

      <div className="w-full text-center">
        <h1 className="text-xl md:text-xl ">{props?.name}</h1>
        <div className="text-slate-500">{props?.description}</div>
      </div>
      <div className="absolute p-2 md:p-4 inset-x-0 bottom-0">
        {map(props?.starters, (starter, index) =>
          starter ? (
            <div
              className="mb-4 cursor-pointer"
              onClick={() => {
                setInput?.(starter);
              }}
            >
              <Chip size="lg" color="primary" variant="flat" key={index}>
                {starter}
              </Chip>
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
};

export default BotInfoCard;
