"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useChat, Message } from '@/contexts/chat-context';
import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      "flex w-full mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-lg px-4 py-2",
        isUser 
          ? "bg-accent text-accent-foreground" 
          : "bg-secondary text-primary"
      )}>
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                code: ({ className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match;
                  return isInline ? (
                    <code className={cn("bg-muted px-1 py-0.5 rounded text-sm", className)} {...props}>
                      {children}
                    </code>
                  ) : (
                    <pre className="bg-tokyo-night-bg-dark rounded p-2 overflow-x-auto">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        <div className="text-xs opacity-70 mt-1">
          {message.timestamp?.toLocaleTimeString()}
          {message.model && ` • ${message.model}`}
        </div>
      </div>
    </div>
  );
}

export function ChatInput() {
  const { state, sendMessage } = useChat();
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || state.isLoading) return;

    const messageContent = input.trim();
    setInput('');
    
    try {
      await sendMessage(messageContent);
    } catch (error) {
      console.error('Failed to send message:', error);
      // The error handling is already done in the sendMessage function
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <form onSubmit={handleSubmit} className="border-t border-tokyo-night-fg-dark border-opacity-20 p-4">
      <div className="flex gap-2 items-end">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('chat.placeholder')}
          className={cn(
            "flex-1 min-h-[44px] max-h-32 resize-none rounded-lg border border-primary",
            "bg-secondary text-primary px-3 py-2 text-sm placeholder:text-secondary",
            "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          )}
          disabled={state.isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || state.isLoading}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-lg",
            "bg-accent hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed",
            "text-accent-foreground transition-all duration-200"
          )}
        >
          {state.isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>
    </form>
  );
}

export function ChatInterface() {
  const { state } = useChat();
  const { t } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {state.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-tokyo-night-comment">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2 text-primary">
                {t('chat.welcome')}
              </h2>
              <p className="text-tokyo-night-comment">
                {t('chat.newChat')}
              </p>
            </div>
          </div>
        ) : (
          <>
            {state.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {state.isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-secondary rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-accent" />
                    <span className="text-sm text-secondary">
                      {t('chat.thinking')}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      <ChatInput />
    </div>
  );
}
