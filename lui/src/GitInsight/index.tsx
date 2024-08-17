import React, { useEffect, useState } from 'react';
import CountCard from './components/CountCard';

export interface GitInsightProps {
  forkCount: number;
  commitCount: number;
  starCount: number;
}

const GitInsight = (props: GitInsightProps) => {
  const { forkCount = 0, commitCount = 0, starCount = 0 } = props;
  const [showNumber2, setShowNumber2] = useState<boolean>(false);
  const [showNumber3, setShowNumber3] = useState<boolean>(false);

  const DELAY = 333;

  useEffect(() => {
    const timer2 = setTimeout(() => {
      setShowNumber2(true);
    }, DELAY);

    const timer3 = setTimeout(() => {
      setShowNumber3(true);
    }, DELAY * 2);

    return () => {
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="flex justify-start items-center gap-x-[13px]">
      <div className="opacity-0 transform transition-opacity duration-500 delay-200 animate-fade-in">
        <CountCard type="star" count={starCount} play={true} />
      </div>

      {showNumber2 && (
        <div className="opacity-0 transform transition-opacity duration-500 delay-200  animate-fade-in">
          <CountCard type="fork" count={forkCount} play={showNumber2} />
        </div>
      )}

      {showNumber3 && (
        <div className="opacity-0 transform transition-opacity duration-500 delay-200  animate-fade-in">
          <CountCard type="commit" count={commitCount} play={showNumber3} />
        </div>
      )}
    </div>
  );
};

export default GitInsight;
