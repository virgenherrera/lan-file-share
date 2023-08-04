import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map, of, switchMap, tap } from 'rxjs';
import { CompletionsResponse, Message } from '../types';

@Injectable()
export class ChatGptService implements OnModuleInit {
  private apiKey: string;
  private readonly endpoint = 'https://api.openai.com/v1/chat/completions';
  private context: Message[];

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async onModuleInit() {
    try {
      this.apiKey = this.configService.getOrThrow<string>(
        'APP_OPEN_AI_API_KEY',
      );
      this.clearContext();
    } catch (error) {
      const errMsg =
        'Error reading APP_OPEN_AI_API_KEY Environment Variable\n\tplease provide it and try to launch the service again.';

      console.error(errMsg);

      throw Error(errMsg);
    }
  }

  async talkToChatGpt(prompt: string): Promise<string> {
    const model = 'gpt-3.5-turbo';
    const message: Message = {
      role: 'user',
      content: prompt,
    };
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };

    const req$ = of(message).pipe(
      tap(msg => this.context.push(msg)),
      map(() => this.context),
      switchMap(messages =>
        this.httpService.post<CompletionsResponse>(
          this.endpoint,
          {
            model,
            messages,
          },
          { headers },
        ),
      ),
      map(res => res.data.choices.shift().message),
      tap(message => this.context.push(message)),
      map(message => message.content),
    );

    return firstValueFrom(req$);
  }

  clearContext() {
    this.context = [
      {
        role: 'system',
        content: 'You are a helpful assistant.',
      },
    ];
  }
}
