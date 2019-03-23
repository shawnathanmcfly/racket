#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <SDL2/SDL.h>
#include "player.h"
#include "map.h"
#include "objects.h"
#include "graphics.h"
#include "ray.h"

unsigned short quit = 0;

//
//Main loop for EMSCRIPTEN to use in browser SDL_Window
//
void main_loop(){

	SDL_Event e;

	while( !quit ){
		while( SDL_PollEvent( &e ) != 0 )
			;

		const unsigned char *currentKeyStates = SDL_GetKeyboardState( NULL );
		if( currentKeyStates[ SDL_SCANCODE_Q ] )
		{
			quit = 1;
		}
		if( currentKeyStates[ SDL_SCANCODE_RIGHT ] )
		{
			rot += 1 * 3.14 / 180;
			if( rot > 6.28 )
				rot = 0;
		}
		if( currentKeyStates[ SDL_SCANCODE_LEFT ] )
		{
			rot += -(1 * 3.14 / 180);
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

		/* Clear Screen */
		SDL_Rect clear;
		clear.x = 0;
		clear.y = 0;
		clear.w = 640;
		clear.h = 480;
		SDL_SetRenderDrawColor(renderer, 0x00, 0x00, 0x00, 0xff);
		SDL_RenderFillRect( renderer, &clear );

		cast_rays();

		draw_objects();

		SDL_RenderPresent( renderer );

		SDL_Delay( 5 );
	}
}

int main( int argc, char *argv[] ){

	graphics_init();

	//
	//point main loop function to emscripten
	//

	load_object( 0, 600, 800, 0.42, 2, bad );
	load_object( 0, 600, 1000, 0.42, 2, bad );
	load_object( 0, 600, 1200, 0.42, 2, bad );
	load_object( 0, 600, 1400, 0.42, 2, bad );
	load_object( 0, 600, 1600, 0.42, 2, bad );
	load_object( 0, 600, 1800, 0.42, 2, bad );

	main_loop();

	destroy_objects();

	graphics_rem();

  return 0;
}
