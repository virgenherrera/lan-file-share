import { Criteria } from './criteria.interface';
import { FindAndCountDto } from './find-and-count.interface';
import { FoundAndCounted } from './found-and-counted.interface';

export interface IFullRepository<T> {
  batchCreate(dtos: T[]): Promise<T[]>;
  create(dto: T): Promise<T>;
  delete(id: string): Promise<T | void>;
  find(dto: Criteria<T>): Promise<T[]>;
  findAndCount(dto: FindAndCountDto<T>): Promise<FoundAndCounted<T>>;
  findById(id: string): Promise<T>;
  findOne(dto: Criteria<T>): Promise<T>;
  update(id: string, dto: Partial<T>): Promise<T>;
}

export type IRepository<T> = Partial<IFullRepository<T>>;
