import { z } from 'zod';

export const GetSongQueryDto = z.object({
  name: z.string().optional(),
});

export const CreateSongBodyDto = z.object({
  name: z.string(),
  artist: z.string(),
});
