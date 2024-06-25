import Lottie from 'lottie-react';
import peterCatWalkAnimation from '../public/loading.json';

const FullPageSkeleton = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center bg-white bg-opacity-75">
      <Lottie
        animationData={peterCatWalkAnimation}
        loop={true}
        style={{ width: '50%', height: '50%' }}
      />
    </div>
  );
};

export default FullPageSkeleton;
