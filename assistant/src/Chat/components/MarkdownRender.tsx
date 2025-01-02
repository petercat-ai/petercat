import React, { Suspense, lazy } from 'react';

const Markdown = lazy(() =>
  import('@ant-design/pro-editor').then((module) => ({
    default: module.Markdown,
  })),
);

interface IProps {
  className?: string;
  content: string;
}

const MarkdownRender = React.memo((props: IProps) => (
  <Suspense fallback={<>...</>}>
    <Markdown
      className="ant-pro-chat-list-item-message-content"
      style={{ overflowX: 'hidden', overflowY: 'auto' }}
    >
      {props.content}
    </Markdown>
  </Suspense>
));
export default MarkdownRender;
