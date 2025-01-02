/* eslint-disable react/no-danger */
import { Markdown } from '@ant-design/pro-editor';
import React from 'react';

interface IProps {
  className?: string;
  content: string;
}

const MarkdownRender = React.memo((props: IProps) => (
  <Markdown
    className="ant-pro-chat-list-item-message-content"
    style={{ overflowX: 'hidden', overflowY: 'auto' }}
  >
    {props.content}
  </Markdown>
));
export default MarkdownRender;
