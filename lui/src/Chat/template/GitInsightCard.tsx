import React from 'react';
import GitInsight, { GitInsightProps } from '../../GitInsight';

const GitInsightCard = (props: GitInsightProps) => {
  const { forkCount, starCount, commitCount } = props;
  return (
    <div className="overflow-hidden">
      <GitInsight
        forkCount={forkCount}
        starCount={starCount}
        commitCount={commitCount}
      />
    </div>
  );
};

export default GitInsightCard;
