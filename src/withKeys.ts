import {GeneratorFunc, KeyableObject} from './types';
import {KeyGenerators} from './keyGenerators';

/**
 * A simple key extractor/generator, intended for use with arrays of objects in React.  Guarantees unique keys.
 *
 * @param {KeyableObject[]} arr - The array to map keys for.
 * @param {boolean} [consistentStrategy=false] - If true, will try generators in turn until one yields all unique keys.
 * @param {GeneratorFunc[]} [generators=[]] - Generators to use for key creation.
 * @return KeyableObject[]
 */
const withKeys = (
  arr: KeyableObject[],
  consistentStrategy = false,
  ...generators: GeneratorFunc[]
): KeyableObject[] => {
  generators.push(KeyGenerators._fallback());

  let keys: string[] = [];
  const isValidKey = (key: string): boolean =>
    key !== undefined &&
    typeof key !== 'object' &&
    String(key).length > 0 &&
    !keys.includes(key);

  let keyedArr: KeyableObject[] = [];

  while (keys.length < arr.length) {
    keys = [];
    try {
      keyedArr = arr.map(element => {
        let key = '';

        const tools = [...generators];

        let generator = tools.shift();
        while (generator) {
          key = generator(element);

          if (isValidKey(key)) {
            break;
          } else if (consistentStrategy) {
            throw new Error();
          } else {
            generator = tools.shift();
          }
        }

        keys.push(key);
        element.key = key;

        return element;
      });

      break;
    } catch (e) {
      generators.shift();
      // continue;
    }
  }

  return keyedArr;
};

export {withKeys};
