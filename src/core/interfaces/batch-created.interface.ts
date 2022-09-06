export interface SoftBatchCreated {
  successes: Record<number, string>;
  errors: Record<number, string>;
}

export type BatchCreated<T> = T[] | { data: T[] } | SoftBatchCreated;
