import { ZodValidationPipe } from './zod.pipe';
import { z } from 'zod';
import { ArgumentMetadata, UnprocessableEntityException } from '@nestjs/common';

let target: ZodValidationPipe;

const getMetaData = (ty: ArgumentMetadata['type']) => ({
  type: ty,
  metatype: undefined,
  data: undefined, // for select e.g. @Body('someKey')
});

describe('zod pipe', () => {
  describe('case: normal body obj', () => {
    beforeAll(() => {
      const bodySchema = z
        .object({
          username: z.string(),
          id: z.number(),
          email: z.string().email().optional(),
        })
        .strict();

      target = new ZodValidationPipe({
        body: bodySchema,
      });
    });

    it('should return a correct obj and type', () => {
      const rawObj = {
        username: 'iu',
        id: 1,
        email: 'iusocute@gmail.com',
      };

      const result = target.transform(rawObj, getMetaData('body'));

      expect(typeof result.email).toBe('string');
      expect(typeof result.username).toBe('string');
      expect(typeof result.id).toBe('number');
    });

    it('should return a obj without email', () => {
      const rawObj = {
        username: 'iu',
        id: 1,
      };

      const result = target.transform(rawObj, getMetaData('body'));

      expect(typeof result.username).toBe('string');
      expect(typeof result.id).toBe('number');
    });

    it('should error add unrecognized keys to schema', () => {
      const rawObj = {
        username: 'iu',
        id: 1,
        ju: 'nior',
      };

      expect(() => target.transform(rawObj, getMetaData('body'))).toThrow(
        UnprocessableEntityException,
      );
    });

    it('should be error with id', () => {
      const rawObj = {
        username: 'iu',
        id: '1',
      };

      expect(() => target.transform(rawObj, getMetaData('body'))).toThrow(
        UnprocessableEntityException,
      );
    });

    it('should be error with username', () => {
      const rawObj = {
        username: 1,
        id: 1,
      };

      expect(() => target.transform(rawObj, getMetaData('body'))).toThrow(
        UnprocessableEntityException,
      );
    });

    it('should be error with empty obj', () => {
      const rawObj = {};

      expect(() => target.transform(rawObj, getMetaData('body'))).toThrow(
        UnprocessableEntityException,
      );
    });
  });

  // cause everything in query are string and optional
  describe('case: query with default behavior', () => {
    beforeAll(() => {
      const querySchema = z
        .object({
          name: z.string().optional(),
          id: z.string().optional(),
        })
        .strict();

      target = new ZodValidationPipe({
        query: querySchema,
      });
    });

    it('should return a correct obj', () => {
      const rawObj = {
        name: 'iu',
        id: '1',
      };

      const result = target.transform(rawObj, getMetaData('query'));

      expect(typeof result.name).toBe('string');
      expect(typeof result.id).toBe('string');
    });

    it('should return obj without id', () => {
      const rawObj = {
        name: 'iu',
      };

      const result = target.transform(rawObj, getMetaData('query'));

      expect(typeof result.name).toBe('string');
    });

    it('should return obj without name', () => {
      const rawObj = {
        id: '1',
      };

      const result = target.transform(rawObj, getMetaData('query'));

      expect(typeof result.id).toBe('string');
    });

    it('should return empty obj', () => {
      const rawObj = {};

      const result = target.transform(rawObj, getMetaData('query'));

      expect(result).toMatchObject({});
    });
  });

  describe('case: query with auto parsing type', () => {
    beforeAll(() => {
      const querySchema = z
        .object({
          id: z.string().regex(/^\d+$/).transform(Number).optional(),
        })
        .strict();

      target = new ZodValidationPipe({
        query: querySchema,
      });
    });

    it('should return empty obj', () => {
      const rawObj = {};

      const result = target.transform(rawObj, getMetaData('query'));

      expect(result).toMatchObject({});
    });

    it('should return a correct obj and type', () => {
      const rawObj = {
        id: '1',
      };

      const result = target.transform(rawObj, getMetaData('query'));

      expect(typeof result.id).toBe('number');
    });

    it('should be error with id is not string number', () => {
      const rawObj = {
        id: 'iuno1',
      };

      expect(() => target.transform(rawObj, getMetaData('query'))).toThrow(
        UnprocessableEntityException,
      );
    });

    it('should be error with id is number', () => {
      const rawObj = {
        id: 1,
      };

      expect(() => target.transform(rawObj, getMetaData('query'))).toThrow(
        UnprocessableEntityException,
      );
    });
  });

  // cause everything in params are string
  describe('case: params with default behavior', () => {
    beforeAll(() => {
      const paramsSchema = z
        .object({
          id: z.string(),
        })
        .strict();

      target = new ZodValidationPipe({
        params: paramsSchema,
      });
    });

    it('should return a correct obj and type', () => {
      const rawObj = {
        id: '1',
      };

      const result = target.transform(rawObj, getMetaData('param'));

      expect(typeof result.id).toBe('string');
    });

    it('should be error id is string number only', () => {
      const rawObj = {
        id: 1,
      };

      expect(() => target.transform(rawObj, getMetaData('param'))).toThrow(
        UnprocessableEntityException,
      );
    });

    it('should be error it required id', () => {
      const rawObj = {};

      expect(() => target.transform(rawObj, getMetaData('param'))).toThrow(
        UnprocessableEntityException,
      );
    });
  });

  // cause everything in params and parsing type
  describe('case: params with parsing type', () => {
    beforeAll(() => {
      const paramsSchema = z
        .object({
          id: z.string().regex(/^\d+$/).transform(Number),
        })
        .strict();

      target = new ZodValidationPipe({
        params: paramsSchema,
      });
    });

    it('should return a correct obj and type default', () => {
      const rawObj = {
        id: '1',
      };

      const result = target.transform(rawObj, getMetaData('param'));

      expect(typeof result.id).toBe('number');
    });

    it('should be error id is string number only', () => {
      const rawObj = {
        id: 1,
      };

      expect(() => target.transform(rawObj, getMetaData('param'))).toThrow(
        UnprocessableEntityException,
      );
    });

    it('should be error it required id', () => {
      const rawObj = {};

      expect(() => target.transform(rawObj, getMetaData('param'))).toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('case: send both params and body', () => {
    beforeAll(() => {
      const paramsSchema = z
        .object({
          id: z.string().regex(/^\d+$/).transform(Number),
        })
        .strict();

      const bodySchema = z
        .object({
          username: z.string(),
          email: z.string().email(),
          city: z.string().optional(),
          idols: z.array(z.string()).nonempty(),
        })
        .strict();

      target = new ZodValidationPipe({
        params: paramsSchema,
        body: bodySchema,
      });
    });

    it('should return a correct obj and type', () => {
      const rawParams = {
        id: '1',
      };

      const rawBody = {
        username: 'iuno1kub',
        email: 'bbibbi@bbi.com',
        city: 'hong dae',
        idols: ['iu', 'winter'],
      };

      const resultFromParams = target.transform(
        rawParams,
        getMetaData('param'),
      );
      const resultFromBody = target.transform(rawBody, getMetaData('body'));

      expect(typeof resultFromParams.id).toBe('number');
      expect(resultFromBody).toMatchObject(rawBody);
    });

    it('should return a correct obj with optional city', () => {
      const rawParams = {
        id: '1',
      };

      const rawBody = {
        username: 'iuno1kub',
        email: 'bbibbi@bbi.com',
        idols: ['iu', 'winter'],
      };

      const resultFromParams = target.transform(
        rawParams,
        getMetaData('param'),
      );
      const resultFromBody = target.transform(rawBody, getMetaData('body'));

      expect(typeof resultFromParams.id).toBe('number');
      expect(resultFromBody).toMatchObject(rawBody);
    });

    it('should be error idols be empty', () => {
      const rawParams = {
        id: '1',
      };

      const rawBody = {
        username: 'iuno1kub',
        email: 'bbibbi@bbi.com',
        city: 'hong dae',
        idols: [],
      };

      const resultFromParams = target.transform(
        rawParams,
        getMetaData('param'),
      );
      expect(typeof resultFromParams.id).toBe('number');

      expect(() =>
        target
          .transform(rawBody, getMetaData('body'))
          .toThrow(UnprocessableEntityException),
      );
    });

    it('should be error email is invalid format', () => {
      const rawParams = {
        id: '1',
      };

      const rawBody = {
        username: 'iuno1kub',
        email: 'iuwinterkarina',
        city: 'hong dae',
        idols: ['iu'],
      };

      const resultFromParams = target.transform(
        rawParams,
        getMetaData('param'),
      );
      expect(typeof resultFromParams.id).toBe('number');

      expect(() =>
        target
          .transform(rawBody, getMetaData('body'))
          .toThrow(UnprocessableEntityException),
      );
    });
  });
});
