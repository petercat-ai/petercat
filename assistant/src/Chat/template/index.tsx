import React from 'react';
import GitInsightCard from './GitInsightCard';

export const UITemplateRender = ({ templateId, cardData }: { templateId: string, cardData: any }) => {
  if (templateId === 'GIT_INSIGHT') {
    return (
      <GitInsightCard
        forkCount={cardData?.forks}
        starCount={cardData?.stars}
        commitCount={cardData?.commits}
      />
    );
    return null;
  }
};
