#ifndef _SPRITES_H
#define _SPRITES_H

#define NUM_SPRITES 1
////////////////////
#define SPR_PLAYER1 0

typedef struct {
  SDL_Texture *t;
  int w, h;
}Sprite;

struct Hitscan{
  int w, x;
}hitscan;

//hit detection for each player

Sprite *sprite_list[1];
int *hitscan_list = 0;
int hitscan_size = 0;

Sprite *load_sprite( char *s){

  Sprite *t_load = ( Sprite *)malloc( sizeof( Sprite ));
  t_load->t = load_texture( s );
  SDL_QueryTexture(t_load->t, NULL, NULL, &t_load->w, &t_load->h);

  if( t_load->t == 0 )
    return 0;
  else
    return t_load;

}

void load_sprites(){

  sprite_list[SPR_PLAYER1] = load_sprite( "images/bad.bmp" );

  if( sprite_list[SPR_PLAYER1] == 0 )
    printf("Error loading sprite...\n");

}

void dest_sprites(){
  for( int i = 0; i < NUM_SPRITES; i++ )
    free( sprite_list[i] );
}

struct Hitscan draw_sprite( double x, double y, double r, double d, int st ){
  struct Hitscan h;
	double object_angle, player_angle;
  int adjust = 0, lt = 0;

  dest.w = sprite_list[st]->w / d * 577;
	dest.h = sprite_list[st]->h / d * 577;

	player_angle = rot;
	player_angle *= 180 / PI;
	player_angle -= 180;

	object_angle = atan2( player_y - y, player_x - x ) * 180 / PI;

	if( player_x < x){
		if( player_angle < 0 && player_y > y )
			player_angle += 360;
		else if( player_angle < 180 && player_angle > 0 && player_y <= y ){
			object_angle += 360;
		}
	}

	dest.x = ((640 / 2) - (dest.w/2)) + (object_angle - player_angle) * 12;
	dest.y = (240 + ( 200 / d * 577) / 2 ) - dest.h;

  src.x = 0;
  src.y = 0;
  src.h = sprite_list[st]->h;

  if( wallTrace[ dest.x / 2 ] < d )
    lt = 1;

  for( int i = 0; i < dest.w / 2; i++ )
    if( wallTrace[ dest.x / 2 + i ] > d ||
        dest.x / 2 + i > 320 )
      adjust += 2;

  src.w = sprite_list[st]->w;
  if( adjust < dest.w ){
    src.w -= sprite_list[st]->w - (adjust * d / 577);

    if( lt ){
      src.x = sprite_list[st]->w - src.w;
      dest.x += dest.w - adjust;
    }
  }

  dest.w = adjust;

  SDL_RenderCopy( renderer, sprite_list[st]->t, &src, &dest);

  h.x = dest.x;
  h.w = dest.w;

  return h;
}

EMSCRIPTEN_KEEPALIVE
void draw_sprites( double *list, int size ){

  if( size ){
    if( hitscan_list )
      free( hitscan_list );

    hitscan_size = (int)(size / 2);
    hitscan_list = ( int *)malloc( hitscan_size );
  }

	for( int i = 0; i < size; i+=6 ){

		hitscan = draw_sprite( list[i], list[i+1], list[i+2], list[i+3], list[i+4] );
    hitscan_list[i*3] = (int)list[i+5];
    hitscan_list[i*3+1] = hitscan.x;
    hitscan_list[i*3+2] = hitscan.w;

	}

  //make list of sprites in firing range starting from reverse order


  free( list );
}

#endif
