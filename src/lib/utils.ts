import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const THEMES = {
  TOKYO_NIGHT: "tokyo-night",
  TOKYO_LIGHT: "tokyo-light",
} as const;

export const MODELS = {
  DEEPSEEK_CHAT: "deepseek-chat",
  DEEPSEEK_REASONER: "deepseek-reasoner",
  CHATGPT: "chatgpt",
} as const;

export const LANGUAGES = {
  CHINESE: "zh",
  ENGLISH: "en",
} as const;

export type Theme = typeof THEMES[keyof typeof THEMES];
export type Model = typeof MODELS[keyof typeof MODELS];
export type Language = typeof LANGUAGES[keyof typeof LANGUAGES];
