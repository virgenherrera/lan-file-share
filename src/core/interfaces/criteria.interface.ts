export type Condition<T> = T | T[] | any;
export type Criteria<T> = {
  [P in keyof T]?: Condition<T[P]>;
};
