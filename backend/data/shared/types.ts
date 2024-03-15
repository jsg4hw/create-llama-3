
export interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface LLMModel {
  id: number;
  name: string;
  description: string;
}

export interface ChatRequest {
  message: string;
  modelId: number;
}

export interface ChatResponse {
  message: ChatMessage;
}
