import Lottie from 'lottie-react';
import React, { useState } from 'react';

const LoadingAnimation2 = require('../../assets/bubble-2.json');

interface OnceLoadingProps {
  children?: React.ReactNode;
  onComplete?: () => void;
}

const OnceLoading: React.FC<OnceLoadingProps> = (props) => {
  const { children } = props;

  const [complete, setComplete] = useState(false);

  if (complete) {
    return children;
  }

  return (
    <>
      <div className="loading">
        <Lottie
          animationData={LoadingAnimation2}
          autoplay={true}
          loop={false}
          onComplete={() => setComplete(true)}
        />
      </div>
    </>
  );
};

export default OnceLoading;
