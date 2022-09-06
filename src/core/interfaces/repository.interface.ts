import { BatchCreated } from './batch-created.interface';
import { Criteria } from './criteria.interface';
import { IDto, IDtos } from './dto.interface';
import { FindAndCountDto } from './find-and-count.interface';
import { FoundAndCounted } from './found-and-counted.interface';

export interface IRepository<T, U = any> {
  batchCreate?(dtos: IDtos<T, U>): Promise<BatchCreated<T>>;
  create?(dto: IDto<T, U>): Promise<T>;
  delete?(id: string): Promise<T | void>;
  find?(dto: Criteria<T>): Promise<T[]>;
  findAndCount?(dto: FindAndCountDto<T>): Promise<FoundAndCounted<T>>;
  findById?(id: string): Promise<T>;
  findOne?(dto: Criteria<T>): Promise<T>;
  update?(id: string, dto: IDto<T, U>): Promise<T>;
}
