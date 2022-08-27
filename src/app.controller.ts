import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateSongBodyDto, GetSongQueryDto } from './dtos';
import { ZodValidationPipe } from './pipes/zod.pipe';
import { zodToJson } from './utils';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import { TCreateSongBody, TGetSongQuery } from './types';

@Controller('songs')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UsePipes(
    new ZodValidationPipe({
      query: GetSongQueryDto,
    }),
  )
  @ApiQuery({
    schema: zodToJson(GetSongQueryDto) as any,
  })
  getSongs(@Query() query: TGetSongQuery) {
    return this.appService.getSongs(query);
  }

  @Post()
  @UsePipes(
    new ZodValidationPipe({
      body: CreateSongBodyDto,
    }),
  )
  @ApiBody({
    schema: zodToJson(CreateSongBodyDto),
  })
  createSong(@Body() body: TCreateSongBody) {
    return this.appService.createSong(body);
  }
}
