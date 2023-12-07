import React from 'react';
import BotDetail from '@/components/BotDetail';

export default function ChatPage({ params }: { params: { id: string } }) {
  return <BotDetail id={params?.id} />;
}
