import Lottie from 'lottie-react';
import React from 'react';
const LoadingAnimation1 = require('../../assets/bubble-1.json');

interface LoadingProps {
  loop?: boolean;
  onComplete?: () => void;
}

const Loading: React.FC<LoadingProps> = (props) => {
  const { onComplete, loop = true } = props;

  return (
    <div className="loading">
      <Lottie
        animationData={LoadingAnimation1}
        loop={loop}
        autoplay={true}
        onComplete={onComplete}
      />
    </div>
  );
};

export default Loading;
