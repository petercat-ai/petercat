import Lottie from 'lottie-react';
import React, { useMemo } from 'react';

const Fork = require('../../assets/fork.json');
const Commit = require('../../assets/commit.json');
const Star = require('../../assets/star.json');

interface GitInsightIconProps {
  type?: 'fork' | 'commit' | 'star';
}

const GitInsightIcon: React.FC<GitInsightIconProps> = (props) => {
  const { type } = props;

  const animationData = useMemo(() => {
    if (type === 'fork') {
      return Fork;
    }
    if (type === 'commit') {
      return Commit;
    }
    return Star;
  }, [type]);

  return (
    <>
      <div>
        <Lottie
          style={{
            width: 'auto',
            height: '68px',
          }}
          animationData={animationData}
          autoplay={true}
          loop={false}
        />
      </div>
    </>
  );
};

export default GitInsightIcon;
