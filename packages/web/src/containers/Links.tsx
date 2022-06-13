import React from 'react';

const markers = ['*', '*'];

interface LinksProps {
  content: string[];
}
const Links: React.FC<LinksProps> = ({ content }) => {
  if (content.indexOf(markers[0]) < 0) return <>{content.join('')}</>;
  const head = content.splice(0, content.indexOf(markers[0]));
  content.shift();
  const tail = content.splice(content.indexOf(markers[1]));
  tail.shift();
  const body = [...content];
  return (
    <span>
      {head.join('')}
      <b>{body.join('')}</b>
      {<Links content={tail} />}
    </span>
  );
};

interface ContentProps {
  cont?: string;
}
export const TextWithLinks: React.FC<ContentProps> = ({ cont = '' }) => {
  const head = cont.split('');
  return <Links content={head} />;
};
