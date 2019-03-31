#include <emscripten/emscripten.h>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <SDL2/SDL.h>
#include <SDL2/SDL_ttf.h>
#include "jsfuncs.h"
#include "player.h"
#include "graphics.h"
#include "sprites.h"
#include "gui.h"
#include "objects.h"
#include "map.h"
#include "ray.h"

unsigned short quit = 0;

//
//Main loop for EMSCRIPTEN to use in browser SDL_Window
//
void main_loop(){

	SDL_Event e;

	while( SDL_PollEvent( &e ) != 0 ){
		if( type_mode ){
			if( e.type == SDL_KEYDOWN && e.key.keysym.sym == SDLK_BACKSPACE ){
				send_char( 8 );
			}else if( e.type == SDL_TEXTINPUT ){
				send_char( *e.text.text );
			}
		}
	}

	const unsigned char *currentKeyStates = SDL_GetKeyboardState( NULL );
	if( currentKeyStates[ SDL_SCANCODE_RIGHT ] )
	{
		rot += 2 * 3.14 / 180;
		if( rot > 6.28 )
			rot = 0;
	}
	if( currentKeyStates[ SDL_SCANCODE_LEFT ] )
	{
		rot += -(2 * 3.14 / 180);
		if( rot < 0 )
			rot = 6.28;
	}
	if( currentKeyStates[ SDL_SCANCODE_UP ] )
	{

		if( level[(int)player_y / CUBE_SIZE][ (int)(player_x + cos( rot ) * 100) / CUBE_SIZE ] < 1 )
			player_x += cos( rot) * 15;

		if( level[(int)(player_y + sin( rot ) * 100) / 200 ][ (int)player_x / 200 ] < 1 )
			player_y += sin( rot) * 15;
	}
	if( currentKeyStates[ SDL_SCANCODE_DOWN ] )
	{
		if( level[(int)player_y / CUBE_SIZE][ (int)(player_x + cos( rot ) * -100) / CUBE_SIZE ] < 1 )
			player_x += cos( rot) * -100;

		if( level[(int)(player_y + sin( rot ) * -55) / 200 ][ (int)player_x / 200 ] < 1 )
			player_y += sin( rot) * -100;

	}
	if( currentKeyStates[ SDL_SCANCODE_G ] )
	{
		print_players();
	}
	if( currentKeyStates[ SDL_SCANCODE_T ] ){
		type_mode = 1;
		SDL_StartTextInput();
	}
	if( currentKeyStates[ SDL_SCANCODE_RETURN ] ){
		if( type_mode ){
			type_mode = 0;
			SDL_StopTextInput();
			send_msg();

		}
	}

	player_data_from_server();
	send_player_data( player_x, player_y, rot );
	SDL_RenderPresent( renderer );
}

int main( int argc, char *argv[] ){

	player_data_to_server( player_x, player_y, rot );

	graphics_init();
	load_sprites();
	load_gui_sprites();

	//
	//point main loop function to emscripten
	emscripten_set_main_loop( main_loop, -1, 1 );

	graphics_rem();
	dest_sprites();
	dest_gui_sprites();

  return 0;
}
