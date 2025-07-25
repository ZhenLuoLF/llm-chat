"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Model } from '@/lib/utils';
import { streamChatResponse, formatMessagesForApi } from '@/lib/chat-api';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: Model;
}

export interface ChatState {
  messages: Message[];
  currentModel: Model;
  isLoading: boolean;
  error: string | null;
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MODEL'; payload: Model }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'UPDATE_LAST_MESSAGE'; payload: string };

const initialState: ChatState = {
  messages: [],
  currentModel: 'deepseek-chat',
  isLoading: false,
  error: null,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'SET_MODEL':
      return {
        ...state,
        currentModel: action.payload,
      };
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [],
        error: null,
      };
    case 'UPDATE_LAST_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((msg, index) =>
          index === state.messages.length - 1
            ? { ...msg, content: action.payload }
            : msg
        ),
      };
    default:
      return state;
  }
}

const ChatContext = createContext<{
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  sendMessage: (content: string) => Promise<void>;
} | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
      model: state.currentModel,
    };

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Create assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        model: state.currentModel,
      };

      dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });

      // Prepare messages for API
      const allMessages = [...state.messages, userMessage];
      const apiMessages = formatMessagesForApi(allMessages);

      // Stream response
      let fullResponse = '';
      for await (const chunk of streamChatResponse({
        messages: apiMessages,
        model: state.currentModel,
        stream: true,
      })) {
        fullResponse += chunk;
        dispatch({ type: 'UPDATE_LAST_MESSAGE', payload: fullResponse });
      }

    } catch (error) {
      console.error('Chat error:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to send message'
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <ChatContext.Provider value={{ state, dispatch, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
