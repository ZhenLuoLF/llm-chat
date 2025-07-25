"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'zh' | 'en';

interface Messages {
  [key: string]: string | Messages;
}

const zhMessages = {
  common: {
    send: "发送",
    clear: "清除",
    settings: "设置",
    theme: "主题",
    language: "语言",
    model: "模型"
  },
  chat: {
    placeholder: "输入您的消息...",
    thinking: "思考中...",
    error: "发生错误，请重试",
    welcome: "欢迎使用LLM聊天助手",
    newChat: "开始对话吧！",
    clearConfirm: "确定要清除所有消息吗？"
  },
  themes: {
    tokyoNight: "东京夜晚",
    tokyoNightLight: "东京夜晚浅色"
  },
  models: {
    "deepseek-chat": "DeepSeek Chat",
    "deepseek-reasoner": "DeepSeek Reasoner",
    chatgpt: "ChatGPT"
  },
  languages: {
    chinese: "中文",
    english: "English"
  }
};

const enMessages = {
  common: {
    send: "Send",
    clear: "Clear",
    settings: "Settings",
    theme: "Theme",
    language: "Language",
    model: "Model"
  },
  chat: {
    placeholder: "Type your message...",
    thinking: "Thinking...",
    error: "An error occurred, please try again",
    welcome: "Welcome to LLM Chat Assistant",
    newChat: "Start a conversation!",
    clearConfirm: "Are you sure you want to clear all messages?"
  },
  themes: {
    tokyoNight: "Tokyo Night",
    tokyoNightLight: "Tokyo Night Light"
  },
  models: {
    "deepseek-chat": "DeepSeek Chat",
    "deepseek-reasoner": "DeepSeek Reasoner",
    chatgpt: "ChatGPT"
  },
  languages: {
    chinese: "中文",
    english: "English"
  }
};

const messages: Record<Language, Messages> = {
  zh: zhMessages,
  en: enMessages,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh');

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: string | Messages = messages[language];
    
    for (const k of keys) {
      if (typeof value === 'object' && value[k]) {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
