import Lottie from 'lottie-react';
import React from 'react';
const LoadingAnimationStart = require('../../assets/bubble-start.json');

interface LoadingStartProps {
  loop?: boolean;
  onComplete?: () => void;
}

const LoadingStart: React.FC<LoadingStartProps> = (props) => {
  const { onComplete, loop = true } = props;

  return (
    <div className="loading">
      <Lottie
        animationData={LoadingAnimationStart}
        loop={loop}
        autoplay={true}
        onComplete={onComplete}
      />
    </div>
  );
};

export default LoadingStart;
