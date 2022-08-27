import { GetSongQueryDto, CreateSongBodyDto } from '../dtos/songs.dto';
import { z } from 'zod';

export type TGetSongQuery = z.infer<typeof GetSongQueryDto>;
export type TCreateSongBody = z.infer<typeof CreateSongBodyDto>;
