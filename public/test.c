#include <math.h>
#include <stdio.h>
#include <SDL.h>

#define PI   3.14159265358979323846264338327950288
#define CUBE_SIZE 200

SDL_Window *window = 0;
SDL_Renderer *renderer = 0;
SDL_Surface *back = 0;

unsigned short quit = 0;
double player_dir = -1, player_x = 300, player_y = 300, rot = 0;


int map_width = CUBE_SIZE * 19, map_height = CUBE_SIZE * 18;
unsigned char level[19][18] = {

	{ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 },
	{ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1 },
	{ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 },
	{ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1 },
	{ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 },
	{ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 1, 1, 1 },
	{ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
	{ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
	{ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
	{ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
	{ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
	{ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
	{ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
	{ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
	{ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
	{ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
	{ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
	{ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
	{ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 }
	
};

double cast_ray( double offset ){

	if( offset > 2 * 3.14 )
		offset -= 2 * 3.14;

	if( offset < 0 )
		offset += 2 * 3.14;

	//horizontal check
	int step_y, step_x, y_start = floor(player_y / CUBE_SIZE) * CUBE_SIZE - 1, x_start, h_check, v_check;
	double hl, vl, r = 0, g = 0, b = 0, hc, vc;
	if( offset > 3.14 ){
		step_y = -CUBE_SIZE;
		step_x = CUBE_SIZE / tan(offset);	
	}else{
		step_y = CUBE_SIZE;
		step_x = -(CUBE_SIZE / tan(offset));
		y_start += CUBE_SIZE + 1;
	}

	x_start = player_x - (player_y-y_start)/tan(offset);

	//SDL_Rect h;
	//h.x = x_start;
	//h.y = y_start;
	//h.w = 2;
	//h.h = 2;
	SDL_SetRenderDrawColor(renderer, 0xff, 0xff, 0xff, 0xff);

	while( x_start > 0 && x_start < map_width &&
			y_start > 0 && y_start < map_height &&
	!level[y_start / CUBE_SIZE][x_start / CUBE_SIZE] ){

		/*SDL_RenderDrawRect( renderer, &h );*/
		v_check++;
		x_start -= step_x;
		y_start += step_y;
		hc = level[y_start / CUBE_SIZE][x_start / CUBE_SIZE];
		/*h.x = x_start;
		h.y = y_start;*/
	}

	
	hl = sqrt( (player_x - x_start) * (player_x - x_start) + (player_y - y_start) * (player_y - y_start) );

	//vertical check
	x_start = floor(player_x/CUBE_SIZE) * CUBE_SIZE;
	if( offset < 4.71 && offset > 1.57 ){
		step_x = CUBE_SIZE;
		step_y = -(CUBE_SIZE * tan(offset));
		x_start -= 1;
	}else{
		step_x = -CUBE_SIZE;
		step_y = CUBE_SIZE * tan(offset);
		x_start += CUBE_SIZE;
	}

	y_start = player_y - (player_x-x_start)*tan(offset);

	//h.x = x_start;
	//h.y = y_start;
	//h.w = 2;
	//h.h = 2;
	SDL_SetRenderDrawColor(renderer, 0xff, 0xff, 0xff, 0xff);

	while( x_start > 0 && x_start < map_width &&
			y_start > 0 && y_start < map_height &&
	
	!level[y_start / CUBE_SIZE][x_start / CUBE_SIZE] ){

		//SDL_RenderDrawRect( renderer, &h );
		x_start -= step_x;
		y_start += step_y;
		h_check++;
		vc = level[y_start / CUBE_SIZE][x_start / CUBE_SIZE];
		//h.x = x_start;
		//h.y = y_start;
	}

	vl = sqrt( (player_x - x_start) * (player_x - x_start) + (player_y - y_start) * (player_y - y_start) );

	if( vl < hl ){
		SDL_SetRenderDrawColor(renderer, 6000 / vl, 6000 / vl, 6000 / vl, 0xff);
		vl *= cos( (offset - rot) + PI / 1080 );
		return vl;
	}else{
		
		SDL_SetRenderDrawColor(renderer, 6000 / hl, 6000 / hl, 6000 / hl, 0xff);
		hl *= cos( (offset - rot) - PI / 1080 );
		return hl;
	}
	/*if( vl < hl )
		SDL_RenderDrawLine(renderer, player_x, player_y, x_start, y_start);
	else
	{
		SDL_RenderDrawLine(renderer, player_x, player_y, hx, hy);
	}*/
	
	//printf( "VERTICAL: %d - HORIZONTAL: %d\n", vl, hl );
}

int cast_rays( ){

	//right half of view
	double offset = 0, dist;
	int slice = 640 / 2;
	SDL_Rect cur_slice;
	cur_slice.x = slice;
	cur_slice.w = 2;
	
	for( int i = 0; i < 160; i++, offset += 3.14 / 1080, slice += 2 ){
		dist = cast_ray( rot + offset );
		cur_slice.x = slice;
		cur_slice.h = 200 / floor( dist ) * 277;
		cur_slice.y = 240 - cur_slice.h / 2;
		//SDL_SetRenderDrawColor(renderer, 0xff, 0xff, 0xff, 0xff);
		SDL_RenderFillRect(renderer, &cur_slice );
	}

	/*left check of view*/
	offset = -1 * 3.14 / 1080;
	slice = 640 / 2;
	for( int i = 0; i < 160; i++, offset -= 1 * 3.14 / 1080, slice -= 2 ){

		dist = cast_ray( rot + offset );
		cur_slice.x = slice;
		cur_slice.h = CUBE_SIZE / floor( dist ) * 277;
		cur_slice.y = 240 - cur_slice.h / 2;
		//SDL_SetRenderDrawColor(renderer, 0xff, 0xff, 0xff, 0xff);
		SDL_RenderFillRect(renderer, &cur_slice );
	}
}

void main_loop(){

	while( !quit ){

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
			rot += 1 * (6 * 3.14 / 360 );
			if( rot > 6.28 ) 
				rot = 0.12;
			SDL_Delay( 20 );
			//printf( "DIR: %f\n", rot * (180.0 / 3.14) );
			
		}
		if( currentKeyStates[ SDL_SCANCODE_LEFT ] )
		{
			rot += -1 * (6 * 3.14 / 360 );
			if( rot < 0 ) 
				rot = 6.28;
			SDL_Delay( 20 );
			//printf( "DIR: %f\n", rot * (180.0 / 3.14) );
		}
		if( currentKeyStates[ SDL_SCANCODE_UP ] )
		{
			player_x += cos( rot) * 10;
			player_y += sin( rot) * 10;
			SDL_Delay( 20 );
			/*printf( "X: %f - Y: %f\n", player_x, player_y );*/
			
		}
		if( currentKeyStates[ SDL_SCANCODE_DOWN ] )
		{
			player_x += cos( rot) * -10;
			player_y += sin( rot) * -10;
			SDL_Delay( 20 );
			/*printf( "X: %f - Y: %f\n", player_x, player_y );*/
			
		}

		/* Clear Screen */
		SDL_Rect clear;
		clear.x = 0;
		clear.y = 0;
		clear.w = 640;
		clear.h = 480;
		SDL_SetRenderDrawColor(renderer, 0x00, 0x00, 0x00, 0xff);
		SDL_RenderFillRect( renderer, &clear );
		
		/*player pos
		SDL_Rect p_pos;
		p_pos.x = player_x;
		p_pos.y = player_y;
		p_pos.w = 2;
		p_pos.h = 2;
		SDL_SetRenderDrawColor(renderer, 0xff, 0x00, 0x00, 0xff);
		SDL_RenderDrawRect( renderer, &p_pos );*/

		//level grid 
		SDL_Rect r_scr;
		SDL_SetRenderDrawColor(renderer, 0xff, 0xff, 0x00, 0xff);
		r_scr.w = CUBE_SIZE;
		r_scr.h = CUBE_SIZE;
		/*for( r_scr.y = 0; r_scr.y < 10 * CUBE_SIZE; r_scr.y += CUBE_SIZE )
			for( r_scr.x = 0; r_scr.x < 10 * CUBE_SIZE; r_scr.x += CUBE_SIZE )
				if( level[ r_scr.y / CUBE_SIZE][r_scr.x / CUBE_SIZE])
					SDL_RenderDrawRect( renderer, &r_scr );*/

		
		/*SDL_SetRenderDrawColor(renderer, 0x00, 0xff, 0x00, 0xff);
		SDL_RenderDrawLine(renderer, player_x, player_y, player_x + cos( rot ) * 10, player_y + sin( rot ) * 10);*/
	

		cast_rays();
		SDL_RenderPresent( renderer );
	}
}

int main( int argc, char *argv[] ){
	
	SDL_Init(SDL_INIT_VIDEO);
	window = SDL_CreateWindow(
        "RACKET",
        SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED,
        640, 480,
        SDL_WINDOW_SHOWN | SDL_WINDOW_OPENGL);

	renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED);
    
	back = SDL_LoadBMP("city_back.gif");

	if( renderer && window ){
		printf("Video Initialized!\n");
	}

	main_loop();

	SDL_FreeSurface( back );
    back = NULL;

	SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();

    return 0;
		
}