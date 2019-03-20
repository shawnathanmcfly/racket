#include <emscripten/emscripten.h>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <SDL2/SDL.h>
#include "jsfuncs.h"
#include "player.h"
#include "objects.h"
#include "graphics.h"
#include "map.h"
#include "ray.h"

unsigned short quit = 0;

//
//Main loop for EMSCRIPTEN to use in browser SDL_Window
//
void main_loop(){
	block->dim.y++;

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
		rot += -(3 * 3.14 / 180 );
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

	cast_rays( );

	draw_object( block );

	SDL_RenderPresent( renderer );
}

int main( int argc, char *argv[] ){

	//1D list of wall distances to clip out sprites if they are behind walls
	block = ( Object *)malloc( sizeof( Object ));
	block->dim.x = 600; block->dim.y = 250;
	block->dim.w = 30; block->dim.h = 150;

	//Send player position to server when they login initially
	//
	//NOTE: This is done to make sure the server adds new player data
	//			to it's dynamic array of current players online
	player_data_to_server( player_x, player_y, rot );

	SDL_Init(SDL_INIT_VIDEO);
	window = SDL_CreateWindow(
        "RACKET",
        SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED,
        640, 480,
        SDL_WINDOW_SHOWN | SDL_WINDOW_OPENGL
			);

	renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED);

	brick = load_texture( "images/brick.bmp");
	ivy = load_texture( "images/ivy.bmp");
	vend = load_texture( "images/vend.bmp");
	bad = load_texture( "images/bad.bmp");

	//Make sure renderer and window were Initialized
	if( renderer && window )
		printf("Video Initialized!\n");

	//
	//point main loop function to emscripten
	//
	emscripten_set_main_loop( main_loop, -1, 1 );

	free( block );
	SDL_DestroyTexture( vend );
	SDL_DestroyTexture( bad );
	SDL_DestroyTexture( ivy );
	SDL_DestroyTexture( brick );
	SDL_DestroyRenderer( renderer );
  SDL_DestroyWindow( window );
  SDL_Quit();

  return 0;
}
