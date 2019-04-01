#ifndef _SOUND_H
#define _SOUND_H

#define NUM_SOUNDS 1
////////////////////////
#define SND_PISTOL 0

Mix_Chunk *snd_list[1];

void sound_control( int force ){
  static int sound_toggle = 0;

  sound_toggle ^= 1;

  if( sound_toggle ){
    SDL_Init( SDL_INIT_AUDIO );

    if( Mix_OpenAudio( 44100, MIX_DEFAULT_FORMAT, 2, 2048 ) < 0 ){
      printf("Failed to open sound\n");

    }else{
      Mix_Volume(1,MIX_MAX_VOLUME/3);
      snd_list[SND_PISTOL] = Mix_LoadWAV( "images/gun.wav" );
    }
  }else{
    Mix_Quit();

    for( int i = 0; i < NUM_SOUNDS; i++ )
      Mix_FreeChunk( snd_list[SND_PISTOL] );
  }

  if( force ){
    Mix_Quit();

    for( int i = 0; i < NUM_SOUNDS; i++ )
      Mix_FreeChunk( snd_list[i] );
  }

}

void play_sound( int snd ){
  if( snd_list[snd] )
    Mix_PlayChannel( 1, snd_list[snd], 0 );
}

#endif
