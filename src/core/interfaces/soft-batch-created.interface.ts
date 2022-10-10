export interface SoftBatchCreated {
  successes: Record<number, string>;
  errors: Record<number, string>;
}
