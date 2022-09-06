import { Criteria } from './criteria.interface';
import { FindAndCountDto } from './find-and-count.interface';
import { FoundAndCounted } from './found-and-counted.interface';

export interface IRepository<T> {
  batchCreate?(dtos: Partial<T>[]): Promise<T[]>;
  create?(dto: Partial<T>): Promise<T>;
  delete?(id: string): Promise<T | void>;
  find?(dto: Criteria<T>): Promise<T[]>;
  findAndCount?(dto: FindAndCountDto<T>): Promise<FoundAndCounted<T>>;
  findById?(id: string): Promise<T>;
  findOne?(dto: Criteria<T>): Promise<T>;
  update?(id: string, dto: Partial<T>): Promise<T>;
}
