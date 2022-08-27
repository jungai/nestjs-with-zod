import { Injectable } from '@nestjs/common';
import { TCreateSongBody, TGetSongQuery } from './types';

@Injectable()
export class AppService {
  private songs = [
    { name: 'bbibbi', artist: 'iu' },
    { name: 'attention', aritist: 'new jeans' },
  ];

  getSongs(query: TGetSongQuery) {
    const { name } = query;

    return this.songs.filter((item) => (name ? item.name.match(name) : true));
  }

  createSong(data: TCreateSongBody) {
    this.songs.push(data);

    return this.songs;
  }
}
