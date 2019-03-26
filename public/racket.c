#include <emscripten/emscripten.h>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <SDL2/SDL.h>
#include "jsfuncs.h"
#include "player.h"
#include "graphics.h"
#include "sprites.h"
#include "objects.h"
#include "map.h"
#include "ray.h"

unsigned short quit = 0;

//
//Main loop for EMSCRIPTEN to use in browser SDL_Window
//
void main_loop(){

	SDL_Event e;

	while( SDL_PollEvent( &e ) != 0 )
		;

	const unsigned char *currentKeyStates = SDL_GetKeyboardState( NULL );
	if( currentKeyStates[ SDL_SCANCODE_RIGHT ] )
	{
		rot += 3 * 3.14 / 180;
		if( rot > 6.28 )
			rot = 0;
	}
	if( currentKeyStates[ SDL_SCANCODE_LEFT ] )
	{
		rot += -(3 * 3.14 / 180);
		if( rot < 0 )
			rot = 6.28;
	}
	if( currentKeyStates[ SDL_SCANCODE_UP ] )
	{
		player_x += cos( rot) * 20;
		player_y += sin( rot) * 20;
	}
	if( currentKeyStates[ SDL_SCANCODE_DOWN ] )
	{
		player_x += cos( rot) * -20;
		player_y += sin( rot) * -20;

	}
	if( currentKeyStates[ SDL_SCANCODE_G ] )
	{
		print_players();

	}

	/* Clear Screen
	SDL_Rect clear;
	clear.x = 0;
	clear.y = 0;
	clear.w = 640;
	clear.h = 480;
	SDL_SetRenderDrawColor(renderer, 0x00, 0x00, 0x00, 0xff);
	SDL_RenderFillRect( renderer, &clear );*/

	player_data_from_server();
	send_player_data( player_x, player_y, rot );
	SDL_RenderPresent( renderer );

}

int main( int argc, char *argv[] ){

	player_data_to_server( player_x, player_y, rot );

	graphics_init();
	load_sprites();

	//
	//point main loop function to emscripten
	emscripten_set_main_loop( main_loop, -1, 1 );

	graphics_rem();
	dest_sprites();

  return 0;
}
