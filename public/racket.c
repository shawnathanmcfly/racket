#include <emscripten/emscripten.h>
#include <math.h>
#include <SDL/SDL.h>

SDL_Window *window = 0;
SDL_Renderer *renderer = 0;

unsigned short quit = 0;
double player_dir = 0, player_x = 640 / 2, player_y = 64 * 4 + 40, rot = 0;

unsigned char level[10][10] = {

	{ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 },
	{ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
	{ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
	{ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
	{ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
	{ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 }
	
	

};



void cast_rays( int dir, unsigned short x, unsigned short y ){

	
	

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
		printf( "DIR: %f\n", rot );
		SDL_Delay( 20 );
	}
	if( currentKeyStates[ SDL_SCANCODE_LEFT ] )
	{
		rot += -1 * (6 * 3.14 / 180 );
		printf( "DIR: %f\n", rot );
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



