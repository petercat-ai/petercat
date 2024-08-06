'use client';
import dynamic from 'next/dynamic';
import Walk from '../public/loading.json';
import WalkJump from '../public/opening.json';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export const SKELETON_MAP = {
  LOADING: Walk,
  OPENING: WalkJump,
};

export interface FullPageSkeletonProps {
  type?: 'LOADING' | 'OPENING';
  loop?: boolean;
  onComplete?: () => void;
}

const FullPageSkeleton = (props: FullPageSkeletonProps) => {
  const { type = 'LOADING', onComplete, loop = true } = props;
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center bg-white bg-opacity-75">
      <Lottie
        loop={loop}
        autoplay={true}
        animationData={SKELETON_MAP[type]}
        onComplete={onComplete}
        style={{
          minHeight: '900px',
          maxHeight: '1440px',
          width: '50%',
          height: '50%',
        }}
      />
    </div>
  );
};

export default FullPageSkeleton;
