import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { LogFileDto } from '../dtos';
import { DtoValidationPipe } from './dto-validation.pipe';

describe('DtoValidationPipe', () => {
  const enum should {
    createInstance = 'Should create instance Properly.',
    transformAndValidate = `Should transform and validate plain object and create instance of given DTO.`,
    throwBadRequest = `Should BadRequestException containing a list of validation errors.`,
  }
  let pipe: DtoValidationPipe = null;

  beforeEach(() => {
    pipe = new DtoValidationPipe();
  });

  it(should.createInstance, () => {
    expect(pipe).toBeInstanceOf(DtoValidationPipe);
  });

  it(should.transformAndValidate, async () => {
    const value = {
      username: 'fake-username',
      password: 'fake-password',
      logFile: '2021-09-24',
      level: 'error',
    };
    const mockMetadata: ArgumentMetadata = {
      type: 'body',
      metatype: LogFileDto,
      data: '',
    };

    await expect(pipe.transform(value, mockMetadata)).resolves.toBeInstanceOf(
      LogFileDto,
    );
  });

  it(should.throwBadRequest, async () => {
    const value = {
      arr: [{ k1: 'v1', k2: 'v2' }],
    };
    const mockMetadata: ArgumentMetadata = {
      type: 'body',
      metatype: LogFileDto,
      data: '',
    };

    await expect(pipe.transform(value, mockMetadata)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
