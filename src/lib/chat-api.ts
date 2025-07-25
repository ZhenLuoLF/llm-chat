// Client-side API service for chat requests
import { Message } from '@/contexts/chat-context';
import { Model } from '@/lib/utils';

export interface ChatApiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatApiRequest {
  messages: ChatApiMessage[];
  model: Model;
  stream?: boolean;
}

export interface ChatApiResponse {
  content?: string;
  error?: string;
  choices?: Array<{
    message: {
      content: string;
    };
  }>;
}

// Convert our Message type to API format
export function formatMessagesForApi(messages: Message[]): ChatApiMessage[] {
  return messages.map(msg => ({
    role: msg.role,
    content: msg.content,
  }));
}

// Send chat request to our API
export async function sendChatRequest(request: ChatApiRequest): Promise<Response> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response;
}

// Stream chat response
export async function* streamChatResponse(request: ChatApiRequest): AsyncIterableIterator<string> {
  const response = await sendChatRequest({ ...request, stream: true });
  
  if (!response.body) {
    throw new Error('No response body');
  }

  const reader = response.body.getReader();
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
          
          if (data === '[DONE]') {
            return;
          }

          try {
            const parsed: ChatApiResponse = JSON.parse(data);
            
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            
            if (parsed.content) {
              yield parsed.content;
            }
          } catch (parseError) {
            console.warn('Failed to parse SSE data:', data, parseError);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// Send non-streaming chat request
export async function sendChatMessage(request: ChatApiRequest): Promise<string> {
  const response = await sendChatRequest({ ...request, stream: false });
  const data: ChatApiResponse = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  // Handle different response formats
  if (data.content) {
    return data.content;
  }

  if (data.choices && data.choices.length > 0) {
    return data.choices[0].message.content;
  }

  throw new Error('No content in response');
}
