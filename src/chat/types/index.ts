export interface CompletionsResponse {
  id: string;
  object: string;
  created: number;
  choices: Choice[];
  usage: Usage;
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface Choice {
  index: number;
  message: Message;
  finish_reason: string;
}

export interface Message {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string;
}
