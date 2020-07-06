import {KeyGenerators} from '../src';
import {KeyableObject} from "../src/types";


const testElement = {
  id: 1,
  name: "Dave Hughes",
  profile: {
    username: "dhughes",
    dob: {
      month: "August"
    }

  }
} as KeyableObject;


describe('existingKey', () => {
  const generator = KeyGenerators.existingKey();

  it('returns a function', () => {
    expect(typeof generator).toBe('function');
  });

  it('uses existing key', () => {
    const existingKey = 'existingKey';

    const elementWithKey = {...testElement};
    elementWithKey.key = existingKey;

    expect(generator(elementWithKey)).toBe(existingKey);
  });

  it('is undefined for blank key', () => {
    const elementWithKey = {...testElement};
    elementWithKey.key = '';

    expect(generator(elementWithKey)).toBeUndefined();
  });

  it('is undefined for non-existing key', () => {
    const elementWithKey = {...testElement};
    elementWithKey.key = undefined;

    expect(generator(elementWithKey)).toBeUndefined();
  });
});


describe('fromPropertyPath', () => {

  describe('dot notation', () => {
    it('returns a function', () => {
      const generator = KeyGenerators.fromPropertyPath("");

      expect(typeof generator).toBe('function');
    });

    it('is defined when path leads to string', () => {
      const generator = KeyGenerators.fromPropertyPath("id");

      const elementWithProp = {...testElement};
      elementWithProp.id = '42';

      expect(generator(elementWithProp)).toBe(elementWithProp.id);
    });

    it('is a string when path leads to number', () => {
      const generator = KeyGenerators.fromPropertyPath("id");

      const elementWithProp = {...testElement};
      elementWithProp.id = 42;

      expect(generator(elementWithProp)).toBe(String(elementWithProp.id));
    });

    it('works for nested properties', () => {
      const generator = KeyGenerators.fromPropertyPath("profile.dob.month");

      expect(generator(testElement)).toBe((testElement as any).profile.dob.month);
    });

    it('is blank when path leads to object', () => {
      const generator = KeyGenerators.fromPropertyPath("profile");

      expect(generator(testElement)).toBe('');
    });

    it('is blank when path is invalid', () => {
      const generator = KeyGenerators.fromPropertyPath("nonExistentProp");

      expect(generator(testElement)).toBe('');
    });
  });


  describe('array notation', () => {
    it('returns a function', () => {
      const generator = KeyGenerators.fromPropertyPath("");

      expect(typeof generator).toBe('function');
    });

    it('is defined when path leads to string', () => {
      const generator = KeyGenerators.fromPropertyPath(["id"]);

      const elementWithProp = {...testElement};
      elementWithProp.id = '42';

      expect(generator(elementWithProp)).toBe(elementWithProp.id);
    });

    it('is a string when path leads to number', () => {
      const generator = KeyGenerators.fromPropertyPath(["id"]);

      const elementWithProp = {...testElement};
      elementWithProp.id = 42;

      expect(generator(elementWithProp)).toBe(String(elementWithProp.id));
    });

    it('works for nested properties', () => {
      const generator = KeyGenerators.fromPropertyPath(["profile", "dob", "month"]);

      expect(generator(testElement)).toBe((testElement as any).profile.dob.month);
    });

    it('works for properties containing dot', () => {
      const generator = KeyGenerators.fromPropertyPath(["car.info", "car.class"]);

      const elementWithProp = {...testElement} as any;
      elementWithProp["car.info"] = {
        "car.class": "v8"
      };

      expect(generator(elementWithProp)).toBe(elementWithProp["car.info"]["car.class"]);
    });

    it('is blank when path leads to object', () => {
      const generator = KeyGenerators.fromPropertyPath(["profile"]);

      expect(generator(testElement)).toBe('');
    });

    it('is blank when path is invalid', () => {
      const generator = KeyGenerators.fromPropertyPath(["nonExistentProp"]);

      expect(generator(testElement)).toBe('');
    });
  });
});


describe('uuid', () => {
  const uuidMatcher = /[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}/i;
  const generator = KeyGenerators.uuid();

  it('returns a function', () => {
    expect(typeof generator).toBe('function');
  });

  it('generates a UUID', () => {
    expect(generator(testElement)).toMatch(uuidMatcher);
  });

  it('generates unique UUIDs every time', () => {
    const uuidSet = new Set();

    const n = 10;
    for (let i = 0; i < n; i++) {
      uuidSet.add(generator(testElement));
    }

    expect(uuidSet.size).toBe(n);
    uuidSet.forEach(((value) => expect(value).toMatch(uuidMatcher)));
  });
});


describe('_fallback', () => {
  it('is an alias for KeyGenerators.uuid()', () => {
    expect(KeyGenerators._fallback === KeyGenerators.uuid).toBeTrue();
  });
});
