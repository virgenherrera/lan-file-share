import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { IsDefined, IsString } from 'class-validator';
import { DtoValidation } from './dto-validation.pipe';

describe('DtoValidationPipe', () => {
  const enum should {
    createInstance = 'Should create instance Properly.',
    transformAndValidate = `Should transform and validate plain object and create instance of given DTO.`,
    throwBadRequest = `Should BadRequestException containing a list of validation errors.`,
  }
  class MockDto {
    @IsDefined()
    @IsString()
    username: string;

    @IsDefined()
    @IsString()
    password: string;
  }
  let pipe: DtoValidation = null;

  beforeAll(() => {
    pipe = new DtoValidation();
  });

  it(should.createInstance, () => {
    expect(pipe).not.toBeNull();
    expect(pipe).toBeInstanceOf(DtoValidation);
  });

  it(should.transformAndValidate, async () => {
    const value = {
      username: 'fake-username',
      password: 'fake-password',
    };
    const mockMetadata: ArgumentMetadata = {
      type: 'body',
      metatype: MockDto,
      data: '',
    };

    await expect(pipe.transform(value, mockMetadata)).resolves.toBeInstanceOf(
      MockDto,
    );
  });

  it(should.throwBadRequest, async () => {
    const value = {
      arr: [{ k1: 'v1', k2: 'v2' }],
    };
    const mockMetadata: ArgumentMetadata = {
      type: 'body',
      metatype: MockDto,
      data: '',
    };

    await expect(pipe.transform(value, mockMetadata)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
