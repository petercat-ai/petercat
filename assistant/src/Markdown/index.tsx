import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';

// 复制按钮组件
const CopyButton: React.FC<{ content: string }> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 重置复制状态
    } catch (error) {
      console.error('copy', error);
    }
  };

  return (
    <button
      className="absolute top-2 right-2 text-xs bg-gray-800 text-white p-1 rounded-md hover:bg-gray-700"
      onClick={handleCopy}
    >
      {copied ? 'copy' : 'copied'}
    </button>
  );
};

// 自定义代码块组件
const CodeBlock: React.FC<{
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}> = ({ inline, className, children }) => {
  const language = className?.replace('language-', '') || ''; // 提取语言信息
  const codeContent = String(children).trim();

  if (inline) {
    return (
      <code className="bg-gray-200 text-red-500 px-1 rounded">{children}</code>
    );
  }

  return (
    <div className="relative group">
      <SyntaxHighlighter
        language={language}
        style={dracula}
        className="rounded-md"
      >
        {codeContent}
      </SyntaxHighlighter>
      <CopyButton content={codeContent} />
    </div>
  );
};

// Markdown 渲染组件
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
