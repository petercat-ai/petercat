import markdownit from 'markdown-it';
/* eslint-disable react/no-danger */
import React from 'react';

const md = markdownit({ html: true, breaks: true });

interface IProps {
  content: string;
}

const MarkdownRender = (props: IProps) => (
  <>
    {/* biome-ignore lint/security/noDangerouslySetInnerHtml: used in demo */}
    <div dangerouslySetInnerHTML={{ __html: md.render(props.content) }} />
  </>
);
export default MarkdownRender;
