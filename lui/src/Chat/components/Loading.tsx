import Lottie from 'lottie-react';
import React from 'react';
const LoadingAnimation = require('../../assets/bubble_animation.json');

interface LoadingProps {
  loop?: boolean;
  onComplete?: () => void;
}

const Loading: React.FC<LoadingProps> = (props) => {
  const { onComplete, loop = true } = props;

  return (
    <Lottie
      animationData={LoadingAnimation}
      loop={loop}
      autoplay={true}
      onComplete={onComplete}
    />
  );
};

export default Loading;
