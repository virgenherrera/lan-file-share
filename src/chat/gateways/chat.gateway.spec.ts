import { Test, TestingModule } from '@nestjs/testing';
import { ChatEvent } from '../enums';
import { ChatService } from '../services';
import { ChatGateway } from './chat.gateway';

describe(`UT:${ChatGateway.name}`, () => {
  const enum should {
    createInstance = 'create instance Properly and set environment to Default.',
    handleNewConnections = 'handle new connections successfully.',
    handleDisconnections = 'handle disconnections successfully.',
    handleMessage = 'handle messages successfully.',
  }

  const mockChatService: Record<
    keyof Pick<ChatService, 'getMessages' | 'addMessage' | 'clearMessages'>,
    any
  > = {
    getMessages: jest.fn(),
    addMessage: jest.fn(),
    clearMessages: jest.fn(),
  };
  const mockSocket: Record<string, any> = {
    id: 'socketId',
    emit: jest.fn(),
  };

  let gateway: ChatGateway;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        { provide: ChatService, useValue: mockChatService },
      ],
    }).compile();

    gateway = testingModule.get<ChatGateway>(ChatGateway);
  });

  afterEach(() => jest.clearAllMocks());

  it(should.createInstance, () => {
    expect(gateway).toBeDefined();
  });

  it(should.handleNewConnections, () => {
    mockChatService.getMessages.mockReturnValue(['message1', 'message2']);
    gateway.handleConnection(mockSocket as any);
    expect(mockSocket.emit).toHaveBeenCalledWith(ChatEvent.allMessages, [
      'message1',
      'message2',
    ]);
  });

  it(should.handleDisconnections, () => {
    gateway.handleDisconnect(mockSocket as any);
    expect(mockChatService.clearMessages).toHaveBeenCalledTimes(1);
  });

  it(should.handleMessage, async () => {
    const payload = 'Hello, world!';
    mockChatService.addMessage.mockResolvedValue('Answer from GPT');

    gateway.handleConnection(mockSocket as any);

    await gateway.handleMessage(mockSocket as any, payload);

    expect(mockChatService.addMessage).toHaveBeenCalledWith(payload);
    expect(mockSocket.emit).toHaveBeenCalledWith(ChatEvent.newMessage, payload);
    expect(mockSocket.emit).toHaveBeenCalledWith(ChatEvent.chatTyping);
    expect(mockSocket.emit).toHaveBeenCalledWith(
      ChatEvent.chatAnswered,
      'Answer from GPT',
    );
  });
});
