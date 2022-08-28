import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  UnprocessableEntityException,
} from '@nestjs/common';
import { z } from 'zod';

interface IZodPipeSchema {
  params?: z.ZodObject<z.ZodRawShape, 'strict'>;
  query?: z.ZodObject<z.ZodRawShape, 'strict'>;
  body?: z.ZodObject<z.ZodRawShape, 'strict'>;
}

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: IZodPipeSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type === 'query' && this.schema?.query) {
      const result = this.schema.query?.safeParse(value);

      if (!result.success) {
        throw new UnprocessableEntityException({ msg: result.error });
      }

      return result.data;
    }

    if (metadata.type === 'param' && this.schema?.params) {
      const result = this.schema.params?.safeParse(value);
      if (!result.success) {
        throw new UnprocessableEntityException({ msg: result.error });
      }

      return result.data;
    }

    if (metadata.type === 'body' && this.schema?.body) {
      const result = this.schema.body?.safeParse(value);

      if (!result.success) {
        throw new UnprocessableEntityException({ msg: result.error });
      }

      return result.data;
    }

    throw new UnprocessableEntityException();
  }
}
