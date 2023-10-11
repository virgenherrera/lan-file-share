import { Test, TestingModule } from '@nestjs/testing';

import { NotFound } from '../../common/exceptions';
import { MimeService } from './mime.service';

describe(`UT:${MimeService.name}`, () => {
  const enum should {
    createInstance = 'should create instance properly.',
    returnMimeType = 'should return correct MIME type for given extension.',
    returnDescription = 'should return correct description for given extension.',
    throwNotFoundForInvalidMime = 'should throw NotFound for invalid MIME type.',
    throwNotFoundForInvalidDescription = 'should throw NotFound for invalid description.',
  }

  let service: MimeService = null;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MimeService],
    }).compile();

    service = module.get(MimeService);
  });

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(MimeService);
  });

  it(should.returnMimeType, () => {
    const extension = '.3g2';

    const result = service.getMime(extension);

    expect(result).toEqual('audio/3gpp2');
  });

  it(should.returnDescription, () => {
    const extension = '.3g2';

    const result = service.getDescription(extension);

    expect(result).toEqual('3GPP2 audio/video container');
  });

  it(should.throwNotFoundForInvalidMime, () => {
    const extension = 'invalid_ext';

    expect(() => service.getMime(extension)).toThrow(NotFound);
  });

  it(should.throwNotFoundForInvalidDescription, () => {
    const extension = 'invalid_ext';

    expect(() => service.getDescription(extension)).toThrow(NotFound);
  });
});
