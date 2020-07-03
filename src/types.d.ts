export interface KeyableObject {
  key?: string;
}

export type GeneratorFunc = (element: KeyableObject) => string;
