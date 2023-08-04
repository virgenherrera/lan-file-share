import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ChatGptService } from './chat-gpt.service';

describe(`UT:${ChatGptService.name}`, () => {
  const enum should {
    createInstance = 'create instance Properly and set environment to Default.',
    throwExceptionOnModuleInitWhenNoApiKey = 'throw exception during module initialization when no api key is provided.',
    notThrowExceptionOnModuleInitWhenApiKeyExists = 'not throw exception during module initialization when api key is provided.',
    talkToChatGptSuccessfully = 'talk to chat gpt successfully and return the chatbot response.',
    clearContextSuccessfully = 'clear context successfully.',
  }

  const mockConfigService: Record<
    keyof Pick<ConfigService, 'getOrThrow'>,
    any
  > = {
    getOrThrow: jest.fn(),
  };
  const mockHttpService: Record<keyof Pick<HttpService, 'post'>, any> = {
    post: jest.fn(),
  };
  const MockConfigServiceProvider = {
    provide: ConfigService,
    useValue: mockConfigService,
  };
  const MockHttpServiceProvider = {
    provide: HttpService,
    useValue: mockHttpService,
  };

  let service: ChatGptService = null;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        MockConfigServiceProvider,
        MockHttpServiceProvider,
        ChatGptService,
      ],
    }).compile();

    service = testingModule.get(ChatGptService);
  });

  afterEach(() => jest.clearAllMocks());

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(ChatGptService);
  });

  it(should.throwExceptionOnModuleInitWhenNoApiKey, async () => {
    mockConfigService.getOrThrow.mockImplementation(() => {
      throw new Error();
    });

    const getOrThrowSpy = jest.spyOn(mockConfigService, 'getOrThrow');

    await expect(service.onModuleInit()).rejects.toThrowError();
    expect(getOrThrowSpy).toHaveBeenCalledTimes(1);
  });

  it(should.notThrowExceptionOnModuleInitWhenApiKeyExists, async () => {
    mockConfigService.getOrThrow.mockReturnValue('api-key');

    const getOrThrowSpy = jest.spyOn(mockConfigService, 'getOrThrow');

    await expect(service.onModuleInit()).resolves.not.toThrowError();
    expect(getOrThrowSpy).toHaveBeenCalledTimes(1);
  });

  it(should.talkToChatGptSuccessfully, async () => {
    const prompt = 'foo bar baz';
    const mockAnswer = 'mock answer';
    const mockResponse = {
      data: { choices: [{ message: { content: mockAnswer } }] },
    };

    mockConfigService.getOrThrow.mockReturnValue('api-key');
    mockHttpService.post.mockResolvedValue(mockResponse);

    const postSpy = jest.spyOn(mockHttpService, 'post');

    await service.onModuleInit();

    const result = await service.talkToChatGpt(prompt);

    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockAnswer);
  });

  it(should.clearContextSuccessfully, () => {
    expect(() => service.clearContext()).not.toThrow();
  });
});
