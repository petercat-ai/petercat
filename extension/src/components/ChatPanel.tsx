'use client';
import { Chat } from 'petercat-lui';
import React from 'react';
const ChatPanel = () => {
  return (
    <Chat
      apiDomain="https://api.petercat.ai"
      apiUrl="/api/chat/stream_qa"
      token="594dc633-acf6-4fed-a52d-c5852c6f4694"
    />
  );
};

export default ChatPanel;
