import { ZodValidationPipe } from './zod.pipe';
import { z } from 'zod';
import { ArgumentMetadata, UnprocessableEntityException } from '@nestjs/common';

let target: ZodValidationPipe;

const metadata: ArgumentMetadata = {
  type: 'body',
  metatype: undefined,
  data: undefined, // for select e.g. @Body('someKey')
};

describe('zod pipe', () => {
  describe('case: normal obj', () => {
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

      const result = target.transform(rawObj, metadata);

      expect(typeof result.email).toBe('string');
      expect(typeof result.username).toBe('string');
      expect(typeof result.id).toBe('number');
    });

    it('should return a obj without email', () => {
      const rawObj = {
        username: 'iu',
        id: 1,
      };

      const result = target.transform(rawObj, metadata);

      expect(typeof result.username).toBe('string');
      expect(typeof result.id).toBe('number');
    });

    it('should error add unrecognized keys to schema', () => {
      const rawObj = {
        username: 'iu',
        id: 1,
        ju: 'nior',
      };

      expect(() => target.transform(rawObj, metadata)).toThrow(
        UnprocessableEntityException,
      );
    });
  });
});
