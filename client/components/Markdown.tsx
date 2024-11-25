'use client';
import React from 'react';
import { Markdown as AntMarkdown } from '@ant-design/pro-editor';
import { ThemeProvider } from 'antd-style';

const Markdown: React.FC<{ markdownContent: string }> = ({
  markdownContent,
}) => {
  return (
    <ThemeProvider appearance="dark">
      <AntMarkdown
        className="ant-pro-chat-list-item-message-content"
        style={{ overflowX: 'hidden', overflowY: 'auto' }}
      >
        {markdownContent}
      </AntMarkdown>
    </ThemeProvider>
  );
};

export default Markdown;
