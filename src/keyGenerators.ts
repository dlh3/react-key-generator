import {v4 as uuid} from 'uuid';
import {GeneratorFunc} from './types';

/**
 * A selection of predefined {@link GeneratorFunc} functions to choose from.
 */
export class KeyGenerators {
  /**
   * Validates and normalizes a key candidate.  Keys must be strings or convertible to strings (number, boolean, etc).
   *
   * @param {unknown} key - The key candidate.
   * @return string
   */
  private static normalizeKey = (key: unknown) =>
    key === undefined || typeof key === 'object' ? '' : String(key);

  /**
   * Use the existing key.  Useful when adding elements to an array that already has keys.
   * If used, will usually be the first generator provided.
   *
   * @return GeneratorFunc
   */
  static existingKey = (): GeneratorFunc => (
    obj: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ) => KeyGenerators.normalizeKey(obj.key);

  /**
   * A property extractor, allowing the objects to be walked until the leaf node is extracted.
   *
   * @param {string | string[]} propPath - The properties to traverse through the objects.
   * @return GeneratorFunc
   */
  static fromPropertyPath = (propPath: string | string[]): GeneratorFunc => (
    obj: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ) => {
    const path = Array.isArray(propPath) ? propPath : propPath.split('.');

    const target = path.reduce((prev, prop) => prev[prop], obj);

    return KeyGenerators.normalizeKey(target);
  };

  /**
   * Generate a UUID (v4).  This is always used as a fallback.
   *
   * @return GeneratorFunc
   */
  static uuid = (): GeneratorFunc => () => uuid();

  /**
   * A fallback generator.  Since this is the automatic fallback, it should guarantee unique values.
   *
   * @return GeneratorFunc
   */
  static _fallback = KeyGenerators.uuid;
}
