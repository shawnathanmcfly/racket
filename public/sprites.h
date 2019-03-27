#ifndef _SPRITES_H
#define _SPRITES_H

#define NUM_SPRITES 1
////////////////////
#define SPR_PLAYER1 0

typedef struct {
  SDL_Texture *t;
  int w, h;
}Sprite;

Sprite *sprite_list[1];

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

void draw_sprite( double x, double y, double r, double d, int st ){
	double object_angle, player_angle;

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

  //src.x = 0;
  //src.y = 0;
  //src.w = 2;
  //src.h = sprite_list[st]->h;
	//for( int i = 0; i < dest.w; i++, src.x += 2 )
    //if( wallTrace[dest.x / 2] > d )
      SDL_RenderCopy( renderer, sprite_list[st]->t, NULL, &dest);

}

EMSCRIPTEN_KEEPALIVE
void draw_sprites( double *list, int size ){

	for( int i = 0; i < size; i+=5 ){
		//printf("%f - %f - %f\n", list[i], list[i+1], list[i+2]);
		draw_sprite( list[i], list[i+1], list[i+2], list[i+3], list[i+4] );

	}
}

#endif
