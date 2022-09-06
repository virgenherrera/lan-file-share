import { Primitive } from './primitive.interface';

type IBaseDto<T, U> = Partial<T> | T | U;

export type DtoWithFlags<T, U = any> = Record<string, Primitive> & {
  dto: IBaseDto<T, U>;
};

export type DtosWithFlags<T, U = any> = Record<string, Primitive> & {
  dtos: IBaseDto<T, U>;
};

export type IDto<T, U = any> = IBaseDto<T, U> | DtoWithFlags<T, U>;

export type IDtos<T, U = any> = Array<IBaseDto<T, U>> | DtosWithFlags<T, U>;
