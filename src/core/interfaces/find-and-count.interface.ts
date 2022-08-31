import { Criteria } from './criteria.interface';

export interface FindAndCountDto<T> {
  criteria: Criteria<T>;
  skip: number;
  limit: number;
}
