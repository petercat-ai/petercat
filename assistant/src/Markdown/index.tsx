import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
export interface MarkdownProps {
  text: string;
  style?: React.CSSProperties;
}

const Markdown: React.FC<MarkdownProps> = ({ text, style }) => {
  return (
    <div style={style} className="prose max-w-none petercat-assistant-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
