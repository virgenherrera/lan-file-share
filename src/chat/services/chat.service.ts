import { Injectable } from '@nestjs/common';
import { ChatGptService } from './chat-gpt.service';

@Injectable()
export class ChatService {
  private messages: string[] = [];

  constructor(private readonly chatGptService: ChatGptService) {}

  getMessages(): string[] {
    return this.messages;
  }

  async addMessage(message: string): Promise<string> {
    const chatGptAnswer = await this.chatGptService.talkToChatGpt(message);

    this.messages.push(message, chatGptAnswer);

    return chatGptAnswer;
  }

  clearMessages(): void {
    this.messages = [];
    this.chatGptService.clearContext();
  }
}
