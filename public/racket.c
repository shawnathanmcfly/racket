#include <emscripten/emscripten.h>
#include <math.h>
#include <stdlib.h>
#include <SDL/SDL.h>

SDL_Window *window = 0;
SDL_Renderer *renderer = 0;

double fov = 60 * 3.14 / 180;
unsigned short quit = 0;
double player_dir = -1, player_x = 20, player_y = 20, rot = 0, view_dist;

int map_width = 64 * 10, map_height = 64 * 6;
unsigned char level[10][10] = {

	{ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 },
	{ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
	{ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
	{ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
	{ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
	{ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 }
	
};

int cast_ray( double offset ){

	if( offset > 2 * 3.14 )
		offset -= 2 * 3.14;

	if( offset <= 0 )
		offset += 2 * 3.14;

	if( !offset )
		return 0;

	//horizontal check
	int step_y, step_x, y_start = floor(player_y / 64) * 64 - 1, x_start, h_check = 0, v_check = 0, hl, vl, hx, hy;
	if( offset > 3.14 ){
		step_y = -64;
		step_x = 64 / tan(offset);
		
	}else{
		step_y = 64;
		step_x = -(64 / tan(offset));
		y_start += 65;	
	}

	x_start = player_x - (player_y-y_start)/tan(offset);

	SDL_Rect h;
	h.x = x_start;
	h.y = y_start;
	h.w = 2;
	h.h = 2;
	SDL_SetRenderDrawColor(renderer, 0xff, 0xff, 0xff, 0xff);

	while( x_start > 0 && x_start < map_width &&
			y_start > 0 && y_start < map_height &&
	!level[y_start / 64][x_start / 64] ){

		SDL_RenderDrawRect( renderer, &h );
		h_check++;
		x_start -= step_x;
		y_start += step_y;
		h.x = x_start;
		h.y = y_start;

	}

	hx = x_start;
	hy = y_start;
	hl = sqrt( (player_x - x_start) * (player_x - x_start) + (player_y - y_start) * (player_y - y_start) );

	//vertical check
	x_start = floor(player_x/64) * 64;
	if( offset < 4.71 && offset > 1.57 ){
		step_x = 64;
		step_y = -(64 * tan(offset));
		x_start -= 1;
	}else{
		step_x = -64;
		step_y = 64 * tan(offset);
		x_start += 64;	
	}

	y_start = player_y - (player_x-x_start)*tan(offset);

	h.x = x_start;
	h.y = y_start;
	h.w = 2;
	h.h = 2;
	SDL_SetRenderDrawColor(renderer, 0xff, 0xff, 0xff, 0xff);

	while( x_start > 0 && x_start < map_width &&
			y_start > 0 && y_start < map_height &&
	
	!level[abs(y_start / 64)][abs(x_start / 64)] ){

		SDL_RenderDrawRect( renderer, &h );
		x_start -= step_x;
		y_start += step_y;
		v_check++;
		h.x = x_start;
		h.y = y_start;

	}

	vl = sqrt( (player_x - x_start) * (player_x - x_start) + (player_y - y_start) * (player_y - y_start) );

	SDL_SetRenderDrawColor(renderer, 0x00, 0xff, 0x00, 0xff);

	if( vl < hl )
		SDL_RenderDrawLine(renderer, player_x, player_y, x_start, y_start);
	else
	{
		SDL_RenderDrawLine(renderer, player_x, player_y, hx, hy);
	}
	
	//printf( "VERTICAL: %d - HORIZONTAL: %d\n", vl, hl );

	return 0;
}

int cast_rays( ){

	//right half of view
	double offset = 0;
	for( int i = 0; i < 31; i++, offset += 1 * 3.14 / 180 ){

	
		cast_ray( rot + offset );

	}

	//left check of view
	offset = -1 * 3.14 / 180;
	for( int i = 0; i < 30; i++, offset -= 1 * 3.14 / 180 ){

		
		cast_ray( rot + offset );

	}

	return 0;
}

void main_loop(){

	SDL_Event e;
	//Handle events on queue
	while( SDL_PollEvent( &e ) != 0 )
		;

	const unsigned char *currentKeyStates = SDL_GetKeyboardState( NULL );
	if( currentKeyStates[ SDL_SCANCODE_Q ] )
	{
		quit = 1;
		
	}
	if( currentKeyStates[ SDL_SCANCODE_RIGHT ] )
	{
		rot += 1 * (6 * 3.14 / 180 );
		//printf( "DIR: %f\n", rot );
		SDL_Delay( 20 );
	}
	if( currentKeyStates[ SDL_SCANCODE_LEFT ] )
	{
		rot += -1 * (6 * 3.14 / 180 );
		//printf( "DIR: %f\n", rot );
		SDL_Delay( 20 );
	}
	if( currentKeyStates[ SDL_SCANCODE_UP ] )
	{
		player_x += cos( rot) * -2;
		player_y += sin( rot) * -2;
		SDL_Delay( 20 );
	}
	if( currentKeyStates[ SDL_SCANCODE_DOWN ] )
	{
		player_x += cos( rot) * 2;
		player_y += sin( rot) * 2;
		SDL_Delay( 20 );
	}

	/* Clear Screen */
	SDL_Rect clear;
	clear.x = 0;
	clear.y = 0;
	clear.w = 640;
	clear.h = 480;
	SDL_SetRenderDrawColor(renderer, 0x00, 0x00, 0x00, 0xff);
	SDL_RenderFillRect( renderer, &clear );
	
	//player pos
	SDL_Rect p_pos;
	p_pos.x = player_x;
	p_pos.y = player_y;
	p_pos.w = 2;
	p_pos.h = 2;
	SDL_SetRenderDrawColor(renderer, 0xff, 0x00, 0x00, 0xff);
	SDL_RenderDrawRect( renderer, &p_pos );

	/* level grid */
	SDL_Rect r_scr;
	SDL_SetRenderDrawColor(renderer, 0xff, 0xff, 0x00, 0xff);
	r_scr.w = 64;
	r_scr.h = 64;
	for( r_scr.y = 0; r_scr.y < 10 * 64; r_scr.y += 64 )
		for( r_scr.x = 0; r_scr.x < 10 * 64; r_scr.x += 64 )
			if( level[ r_scr.y / 64][r_scr.x / 64])
				SDL_RenderDrawRect( renderer, &r_scr );



	cast_rays();



	SDL_RenderPresent( renderer );
	
	
}

int main( int argc, char *argv[] ){
	SDL_Init(SDL_INIT_VIDEO);
	window = SDL_CreateWindow(
        "RACKET",
        SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED,
        640, 480,
        SDL_WINDOW_SHOWN | SDL_WINDOW_OPENGL);

	renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED);
    SDL_SetRenderDrawColor(renderer, 0xff, 0xff, 0xff, 0xff);

	

	if( renderer && window ){
		printf("Video Initialized!\n");
	}

	emscripten_set_main_loop( main_loop, -1, 1 );

	SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();

    return 0;
		
}



