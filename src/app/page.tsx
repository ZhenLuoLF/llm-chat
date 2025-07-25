"use client";

import React, { useState } from 'react';
import { ChatProvider } from '@/contexts/chat-context';
import { LanguageProvider } from '@/contexts/language-context';
import { ChatInterface } from '@/components/chat-interface';
import { Header } from '@/components/header';
import { SettingsPanel } from '@/components/settings-panel';

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <LanguageProvider>
      <ChatProvider>
        <div className="h-screen flex flex-col bg-primary text-primary">
          <Header onSettingsClick={() => setIsSettingsOpen(true)} />
          <main className="flex-1 overflow-hidden">
            <ChatInterface />
          </main>
          <SettingsPanel 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)} 
          />
        </div>
      </ChatProvider>
    </LanguageProvider>
  );
}
