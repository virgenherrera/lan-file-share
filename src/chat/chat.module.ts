import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ChatGateway } from './gateways';
import { ChatGptService, ChatService } from './services';

@Module({
  imports: [HttpModule],
  providers: [ChatGateway, ChatService, ChatGptService],
})
export class ChatModule {}
