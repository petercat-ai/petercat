import React from 'react';
import GitInsightCard from './GitInsightCard';
import LoginCard from './LoginCard';

export const UITemplateRender = ({ templateId, apiDomain, token, cardData }: { templateId: string, apiDomain: string; token: string; cardData: any }) => {
  if (templateId === 'GIT_INSIGHT') {
    return (
      <GitInsightCard
        forkCount={cardData?.forks}
        starCount={cardData?.stars}
        commitCount={cardData?.commits}
      />
    );
  }

  if (templateId === 'LOGIN_INVITE') {
    return (
      <LoginCard apiDomain={apiDomain} token={token} />
    );
  }
  return null;
};
