// LLM Service configurations and API interfaces
// This will be used for connecting to different LLM providers

export interface LLMProvider {
  name: string;
  apiKey: string;
  baseUrl: string;
  model: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// DeepSeek API configurations
export const DEEPSEEK_CHAT_CONFIG: LLMProvider = {
  name: 'DeepSeek Chat',
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseUrl: 'https://api.deepseek.com/v1',
  model: 'deepseek-chat',
};

export const DEEPSEEK_REASONER_CONFIG: LLMProvider = {
  name: 'DeepSeek Reasoner',
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseUrl: 'https://api.deepseek.com/v1',
  model: 'deepseek-reasoner',
};

// ChatGPT API configuration
export const CHATGPT_CONFIG: LLMProvider = {
  name: 'ChatGPT',
  apiKey: process.env.OPENAI_API_KEY || '',
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-3.5-turbo',
};

// Base LLM service class
export abstract class LLMService {
  protected config: LLMProvider;

  constructor(config: LLMProvider) {
    this.config = config;
  }

  abstract sendMessage(request: ChatCompletionRequest): Promise<ChatCompletionResponse>;
  abstract streamMessage(request: ChatCompletionRequest): AsyncIterableIterator<string>;
}

// DeepSeek service implementation
export class DeepSeekService extends LLMService {
  async sendMessage(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        ...request,
        model: this.config.model,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    return response.json();
  }

  async *streamMessage(request: ChatCompletionRequest): AsyncIterableIterator<string> {
    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        ...request,
        model: this.config.model,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                yield content;
              }
            } catch {
              // Skip invalid JSON for DeepSeek
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}

// ChatGPT service implementation
export class ChatGPTService extends LLMService {
  async sendMessage(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        ...request,
        model: this.config.model,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    return response.json();
  }

  async *streamMessage(request: ChatCompletionRequest): AsyncIterableIterator<string> {
    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        ...request,
        model: this.config.model,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                yield content;
              }
            } catch {
              // Skip invalid JSON for ChatGPT
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}

// Factory function to create LLM services
export function createLLMService(provider: 'deepseek-chat' | 'deepseek-reasoner' | 'chatgpt'): LLMService {
  switch (provider) {
    case 'deepseek-chat':
      return new DeepSeekService(DEEPSEEK_CHAT_CONFIG);
    case 'deepseek-reasoner':
      return new DeepSeekService(DEEPSEEK_REASONER_CONFIG);
    case 'chatgpt':
      return new ChatGPTService(CHATGPT_CONFIG);
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}
