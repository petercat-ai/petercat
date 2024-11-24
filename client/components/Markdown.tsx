'use client';
import React from 'react';
import { Markdown as AntMarkdown } from '@ant-design/pro-editor';

const Markdown: React.FC<{ markdownContent: string }> = ({
  markdownContent,
}) => {
  return (
    <AntMarkdown
      className="ant-pro-chat-list-item-message-content"
      style={{ overflowX: 'hidden', overflowY: 'auto' }}
    >
      {markdownContent}
    </AntMarkdown>
  );
};

export default Markdown;
