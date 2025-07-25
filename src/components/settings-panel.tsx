"use client";

import React from 'react';
import { Settings, Palette, Globe, Bot, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useChat } from '@/contexts/chat-context';
import { useLanguage } from '@/contexts/language-context';
import { cn, THEMES, MODELS, LANGUAGES } from '@/lib/utils';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { theme, setTheme } = useTheme();
  const { state, dispatch } = useChat();
  const { language, setLanguage, t } = useLanguage();

  if (!isOpen) return null;

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const handleModelChange = (model: string) => {
    dispatch({ type: 'SET_MODEL', payload: model as typeof MODELS[keyof typeof MODELS] });
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as 'zh' | 'en');
  };

  const getThemeLabel = (theme: string) => {
    const labels: Record<string, Record<string, string>> = {
      'tokyo-night': { zh: '东京夜晚', en: 'Tokyo Night' },
      'tokyo-light': { zh: '东京夜晚浅色', en: 'Tokyo Night Light' },
    };
    return labels[theme]?.[language] || theme;
  };

  const getModelLabel = (model: string) => {
    const labels: Record<string, Record<string, string>> = {
      'deepseek-chat': { zh: 'DeepSeek Chat', en: 'DeepSeek Chat' },
      'deepseek-reasoner': { zh: 'DeepSeek Reasoner', en: 'DeepSeek Reasoner' },
      'chatgpt': { zh: 'ChatGPT', en: 'ChatGPT' },
    };
    return labels[model]?.[language] || model;
  };

  const getLanguageLabel = (lang: string) => {
    const labels: Record<string, string> = {
      zh: '中文',
      en: 'English',
    };
    return labels[lang] || lang;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={cn(
        "bg-white dark:bg-tokyo-night-bg rounded-lg shadow-xl w-full max-w-md mx-4",
        "border border-gray-200 dark:border-tokyo-night-bg-dark"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-tokyo-night-bg-dark">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-tokyo-night-blue" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-tokyo-night-fg">
              {t('common.settings')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-tokyo-night-bg-dark"
            aria-label="Close settings"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-tokyo-night-comment" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Theme Selection */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="h-4 w-4 text-tokyo-night-magenta" />
              <label className="text-sm font-medium text-gray-900 dark:text-tokyo-night-fg">
                {t('common.theme')}
              </label>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {Object.values(THEMES).map((themeOption) => (
                <button
                  key={themeOption}
                  onClick={() => handleThemeChange(themeOption)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border-2 transition-all",
                    theme === themeOption
                      ? "border-tokyo-night-blue bg-tokyo-night-blue bg-opacity-10"
                      : "border-gray-200 dark:border-tokyo-night-bg-dark hover:border-tokyo-night-blue hover:border-opacity-50",
                    "text-left"
                  )}
                >
                  <span className="text-sm text-gray-900 dark:text-tokyo-night-fg">
                    {getThemeLabel(themeOption)}
                  </span>
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2",
                    theme === themeOption
                      ? "border-tokyo-night-blue bg-tokyo-night-blue"
                      : "border-gray-300 dark:border-tokyo-night-comment"
                  )} />
                </button>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Bot className="h-4 w-4 text-tokyo-night-green" />
              <label className="text-sm font-medium text-gray-900 dark:text-tokyo-night-fg">
                {t('common.model')}
              </label>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {Object.values(MODELS).map((model) => (
                <button
                  key={model}
                  onClick={() => handleModelChange(model)}
                  disabled={model === 'chatgpt'} // Only DeepSeek visible for now
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border-2 transition-all",
                    state.currentModel === model
                      ? "border-tokyo-night-blue bg-tokyo-night-blue bg-opacity-10"
                      : "border-gray-200 dark:border-tokyo-night-bg-dark hover:border-tokyo-night-blue hover:border-opacity-50",
                    model === 'chatgpt' && "opacity-50 cursor-not-allowed",
                    "text-left"
                  )}
                >
                  <div>
                    <span className="text-sm text-gray-900 dark:text-tokyo-night-fg">
                      {getModelLabel(model)}
                    </span>
                    {model === 'chatgpt' && (
                      <div className="text-xs text-gray-500 dark:text-tokyo-night-comment">
                        {language === 'zh' ? '即将推出' : 'Coming Soon'}
                      </div>
                    )}
                  </div>
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2",
                    state.currentModel === model
                      ? "border-tokyo-night-blue bg-tokyo-night-blue"
                      : "border-gray-300 dark:border-tokyo-night-comment"
                  )} />
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Globe className="h-4 w-4 text-tokyo-night-cyan" />
              <label className="text-sm font-medium text-gray-900 dark:text-tokyo-night-fg">
                {t('common.language')}
              </label>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {Object.values(LANGUAGES).map((languageOption) => (
                <button
                  key={languageOption}
                  onClick={() => handleLanguageChange(languageOption)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border-2 transition-all",
                    language === languageOption
                      ? "border-tokyo-night-blue bg-tokyo-night-blue bg-opacity-10"
                      : "border-gray-200 dark:border-tokyo-night-bg-dark hover:border-tokyo-night-blue hover:border-opacity-50",
                    "text-left"
                  )}
                >
                  <span className="text-sm text-gray-900 dark:text-tokyo-night-fg">
                    {getLanguageLabel(languageOption)}
                  </span>
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2",
                    language === languageOption
                      ? "border-tokyo-night-blue bg-tokyo-night-blue"
                      : "border-gray-300 dark:border-tokyo-night-comment"
                  )} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
