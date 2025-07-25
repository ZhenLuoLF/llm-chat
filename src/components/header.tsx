"use client";

import React from 'react';
import { Settings, MessageSquare, Trash2 } from 'lucide-react';
import { useChat } from '@/contexts/chat-context';
import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onSettingsClick: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  const { state, dispatch } = useChat();
  const { language, t } = useLanguage();

  const handleClearMessages = () => {
    if (window.confirm(t('chat.clearConfirm'))) {
      dispatch({ type: 'CLEAR_MESSAGES' });
    }
  };

  return (
    <header className={cn(
      "flex items-center justify-between p-4 border-b border-primary bg-primary backdrop-blur-sm"
    )}>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-accent" />
          <h1 className="text-xl font-bold text-primary">
            LLM Chat
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full bg-accent text-accent-foreground font-medium">
            {state.currentModel.toUpperCase()}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-secondary-badge text-badge font-medium">
            {language.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {state.messages.length > 0 && (
          <button
            onClick={handleClearMessages}
            className={cn(
              "p-2 rounded-lg hover:bg-secondary",
              "text-secondary hover:text-tokyo-night-red",
              "transition-colors duration-200"
            )}
            title={t('common.clear')}
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
        <button
          onClick={onSettingsClick}
          className={cn(
            "p-2 rounded-lg hover:bg-secondary",
            "text-secondary hover:text-accent",
            "transition-colors duration-200"
          )}
          title={t('common.settings')}
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
