import React from 'react';
import GitInsightIcon from './GitInsightIcon';
import ScrollNumber from './ScrollNumber';

export interface CountCardProps {
  type: 'fork' | 'commit' | 'star';
  count: number;
  play?: boolean;
}
const CountCard: React.FC<CountCardProps> = (props) => {
  const { type, count, play = false } = props;

  return (
    <div className="flex items-center justify-center">
      <GitInsightIcon type={type} />
      <ScrollNumber count={count} play={play} />
    </div>
  );
};

export default CountCard;
