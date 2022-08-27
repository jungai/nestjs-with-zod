import { zodToJsonSchema } from 'zod-to-json-schema';
import { ZodType } from 'zod';

export function zodToJson(schema: ZodType) {
  return zodToJsonSchema(schema, { target: 'openApi3' });
}
