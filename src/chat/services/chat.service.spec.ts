import { Test, TestingModule } from '@nestjs/testing';
import { ChatGptService } from './chat-gpt.service';
import { ChatService } from './chat.service';

describe(`UT:${ChatService.name}`, () => {
  const enum should {
    createInstance = 'create instance Properly and set environment to Default.',
    getMessagesSuccessfully = 'return all messages successfully.',
    addMessageSuccessfully = 'add a new message and chat GPT response successfully.',
    clearMessagesSuccessfully = 'clear all messages successfully.',
  }

  const mockChatGptService: Record<
    keyof Pick<ChatGptService, 'talkToChatGpt' | 'clearContext'>,
    any
  > = {
    talkToChatGpt: jest.fn(),
    clearContext: jest.fn(),
  };

  const MockChatGptServiceProvider = {
    provide: ChatGptService,
    useValue: mockChatGptService,
  };

  let service: ChatService = null;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [MockChatGptServiceProvider, ChatService],
    }).compile();

    service = testingModule.get(ChatService);
  });

  afterEach(() => jest.clearAllMocks());

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(ChatService);
  });

  it(should.getMessagesSuccessfully, () => {
    const result = service.getMessages();

    expect(Array.isArray(result)).toBe(true);
  });

  it(should.addMessageSuccessfully, async () => {
    const userMessage = 'Hello, world!';
    const chatGptResponse = 'Hello, user!';
    mockChatGptService.talkToChatGpt.mockResolvedValue(chatGptResponse);

    const result = await service.addMessage(userMessage);

    expect(result).toBe(chatGptResponse);
    expect(service.getMessages()).toEqual([userMessage, chatGptResponse]);
  });

  it(should.clearMessagesSuccessfully, () => {
    service.clearMessages();

    expect(service.getMessages()).toEqual([]);
    expect(mockChatGptService.clearContext).toHaveBeenCalledTimes(1);
  });
});
