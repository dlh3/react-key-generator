export interface KeyableObject {
  key?: string;
  [others: string]: unknown;
}

export type GeneratorFunc = (element: KeyableObject) => string;
