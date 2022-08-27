import { UnprocessableEntityException } from '@nestjs/common';
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { z } from 'zod';

interface IZodPipeSchema {
  params?: z.ZodObject<z.ZodRawShape>;
  query?: z.ZodObject<z.ZodRawShape>;
  body?: z.ZodObject<z.ZodRawShape>;
}

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: IZodPipeSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'query' && this.schema?.query) {
      const result = this.schema.query?.safeParse(value);
      if (!result.success) {
        throw new UnprocessableEntityException({ msg: result.error });
      }

      return value;
    }

    if (metadata.type === 'param' && this.schema?.params) {
      const result = this.schema.params?.safeParse(value);
      if (!result.success) {
        throw new UnprocessableEntityException({ msg: result.error });
      }

      return value;
    }

    if (metadata.type === 'body' && this.schema?.body) {
      const result = this.schema.body?.safeParse(value);
      if (!result.success) {
        throw new UnprocessableEntityException({ msg: result.error });
      }

      return value;
    }

    return value;
  }
}
