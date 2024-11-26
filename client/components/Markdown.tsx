'use client';
import React, { useEffect, useState } from 'react';
import { remark } from 'remark';
import html from 'remark-html';

const Markdown: React.FC<{ markdownContent: string; theme: boolean }> = ({
  markdownContent,
  theme = true,
}) => {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    const processMarkdown = async () => {
      const processedContent = await remark()
        .use(html)
        .process(markdownContent);
      setContent(processedContent.toString());
    };
    processMarkdown();
  }, [markdownContent]);
  return (
    <div
      className={`${theme ? 'markdown' : ''}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default Markdown;
