import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Logger } from '../../common/decorators';
import { ChatEvent } from '../enums';
import { ChatService } from '../services';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @Logger() private readonly logger: Logger;
  private readonly clients = new Map<string, Socket>();

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    this.clients.set(client.id, client);
    this.logger.log(`Client connected: ${client.id}`);

    client.emit(ChatEvent.allMessages, this.chatService.getMessages());
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);

    if (this.clients.size === 0) this.chatService.clearMessages();
  }

  @SubscribeMessage(ChatEvent.message)
  async handleMessage(_client: Socket, payload: string) {
    this.clients.forEach(client => {
      client.emit(ChatEvent.newMessage, payload);
      client.emit(ChatEvent.chatTyping);
    });

    const chatGptAnswer = await this.chatService.addMessage(payload);

    this.clients.forEach(client => {
      client.emit(ChatEvent.chatAnswered, chatGptAnswer);
    });
  }
}
