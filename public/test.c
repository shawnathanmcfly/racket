#include <math.h>
#include <stdio.h>
#include <SDL2/SDL.h>

#define PI  3.14159265358979323846264338327950288
#define CUBE_SIZE 200

typedef struct {
	SDL_Rect dim;

}Object;

double *wallTrace;
int traceCnt = 0;

Object *block;

SDL_Rect fillrect;

SDL_Window *window = 0;
SDL_Renderer *renderer = 0;
SDL_Rect src;
SDL_Rect dest;

SDL_Texture *brick = 0, *ivy = 0, *vend = 0, *bad = 0;

unsigned short quit = 0;
double player_dir = -1, rot = 0.12, player_x = 600, player_y = 600;

int map_width = CUBE_SIZE * 18, map_height = CUBE_SIZE * 19;
unsigned char level[19][18] = {

	{ 1, 1, 1, 1, 3, 3, 3, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1 },
	{ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 1 },
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
	{ 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
	{ 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
	{ 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
	{ 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
	{ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 }

};

SDL_Texture *load_texture( char *path ){

	SDL_Surface *temp_surf;
	SDL_Texture *texture ;

	temp_surf = SDL_LoadBMP( path );

	if( temp_surf == 0)
		printf( "ERROR: %s\n", SDL_GetError());

	SDL_SetColorKey( temp_surf, SDL_TRUE, SDL_MapRGB( temp_surf->format, 0x00, 0xff, 0xff ) );
	texture = SDL_CreateTextureFromSurface(renderer, temp_surf);

	if( texture == 0)
		printf( "ERROR: %s\n", SDL_GetError());

	SDL_FreeSurface( temp_surf);

	return texture;
}

void draw_object( Object *object ){

	double d;
	d = sqrt( (player_x - object->dim.x) * (player_x - object->dim.x) +
		(player_y - object->dim.y) * (player_y - object->dim.y) );

  fillrect.w = 80 / d * 577;
	fillrect.h = 150 / d * 577;

	fillrect.x = (640 / 2 - fillrect.w / 2) +
	((atan2( player_y - object->dim.y, player_x - object->dim.x ) * 180 / PI) -
	(rot * 180 / PI - 180)) * 12;

	fillrect.y = 240 - ((150/2) / d * 577) / 2 ;//d - fillrect.h;

	src.w = 57; src.h = 96; src.x = 0, src.y = 0;
	SDL_RenderCopy( renderer, bad, &src, &fillrect);

	/*printf("ANGLE OF OBJECT: %f\n",
		atan2( player_y - object->dim.y, player_x - object->dim.x ) * 180 / PI);

		printf("ANGLE OF PLAYER: %f\n",
			rot * 180 / PI - 180 );*/

}

void cast_ray( double offset, int col_pos ){

	if( offset > 2 * 3.14 )
		offset -= 2 * 3.14;

	if( offset < 0 )
		offset += 2 * 3.14;

	//printf("OFFSET: %f\n", offset );

	//horizontal check

	int y_start = floor(player_y / CUBE_SIZE) * CUBE_SIZE - 1, x_start;
	double step_y, step_x, vh, hh, hl, vl, hc, vc;

	if( offset > 3.14 ){
		step_y = -CUBE_SIZE;
		step_x = CUBE_SIZE / tan(offset);
	}else{
		step_y = CUBE_SIZE;
		step_x = -(CUBE_SIZE / tan(offset));
		y_start += CUBE_SIZE + 1;
	}

	x_start = player_x - (player_y-y_start)/tan(offset);

	if( x_start > 0 && x_start < map_width ){

		hc = level[y_start / CUBE_SIZE][x_start / CUBE_SIZE];
		hh = x_start % CUBE_SIZE;
	}
	while( x_start > 0 && x_start < map_width &&
			y_start > 0 && y_start < map_height &&
	!level[y_start / CUBE_SIZE][x_start / CUBE_SIZE] ){

		x_start -= step_x;
		y_start += step_y;

		if( x_start > 0 && x_start < map_width ){
			hc = level[y_start / CUBE_SIZE][x_start / CUBE_SIZE];
			hh = x_start % CUBE_SIZE;
		}
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

	if( y_start > 0 && y_start < map_height &&
		x_start > 0 && x_start < map_width  ){
		vc = level[y_start / CUBE_SIZE][x_start / CUBE_SIZE];
		vh = y_start % CUBE_SIZE;
	}

	while( y_start > 0 && y_start < map_height &&

	!level[y_start / CUBE_SIZE][x_start / CUBE_SIZE] ){

		x_start -= step_x;
		y_start += step_y;

		if( y_start > 0 && y_start < map_height ){
			vc = level[y_start / CUBE_SIZE][x_start / CUBE_SIZE];
			vh = y_start % CUBE_SIZE;
		}

	}

	vl = sqrt( (player_x - x_start) * (player_x - x_start) + (player_y - y_start) * (player_y - y_start) );

	dest.x = col_pos;
	dest.w = 2;
	src.w = 2;
	src.h = CUBE_SIZE;
	if( vl < hl ){

		wallTrace[traceCnt] = vl;

		dest.h = (int)CUBE_SIZE / floor( vl * (cos( (offset - rot) - PI / 1080 )) ) * 577;
		dest.y = 240 - dest.h / 2;
		src.x = vh;

		if( vc == 1 ){

			SDL_RenderCopy( renderer, brick, &src, &dest);

		} else if( vc == 2){
			SDL_RenderCopy( renderer, ivy, &src, &dest);
		} else if( vc == 3 )
			SDL_RenderCopy( renderer, vend, &src, &dest);

	}else{

		dest.h = (int)CUBE_SIZE / floor( hl * (cos( (offset - rot) - PI / 1080 )) ) * 577;
		dest.y = 240 - dest.h / 2;
		src.x = hh;

		wallTrace[traceCnt] = hl;

		if( hc == 1 ){

			SDL_RenderCopy( renderer, brick, &src, &dest);

		} else if( hc == 2) {
			SDL_RenderCopy( renderer, ivy, &src, &dest);

		} else if( hc == 3)
			SDL_RenderCopy( renderer, vend, &src, &dest);
	}
}

void cast_rays( ){
	traceCnt = 0;
	//right half of view
	double offset = 0, dist;
	int slice = 640 / 2;

	for( int i = 0; i < 160; i++, offset += 3.14 / 1080, slice += 2, traceCnt++ ){

		cast_ray( rot + offset, slice );

	}

	/*left check of view*/
	offset = -1 * 3.14 / 1080;
	slice = 640 / 2;
	for( int i = 0; i < 160; i++, offset -= 1 * 3.14 / 1080, slice -= 2, traceCnt++ ){

		cast_ray( rot + offset, slice );

	}

	traceCnt = 0;
	draw_object( block );
}

void main_loop(){

	while( !quit ){

		block->dim.y++;

		SDL_Event e;
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


		}
		if( currentKeyStates[ SDL_SCANCODE_LEFT ] )
		{
			rot += -1 * (6 * 3.14 / 360 );
			if( rot < 0 )
				rot = 6.28;

		}
		if( currentKeyStates[ SDL_SCANCODE_UP ] )
		{
			player_x += cos( rot) * 10;
			player_y += sin( rot) * 10;
		}
		if( currentKeyStates[ SDL_SCANCODE_DOWN ] )
		{
			player_x += cos( rot) * -10;
			player_y += sin( rot) * -10;


		}

		//Clear Screen
		SDL_Rect clear;
		clear.x = 0;
		clear.y = 0;
		clear.w = 640;
		clear.h = 480;
		SDL_SetRenderDrawColor(renderer, 0x22, 0x22, 0x22, 0xff);
		SDL_RenderFillRect( renderer, &clear );

		cast_rays();
		SDL_RenderPresent( renderer );

		SDL_Delay( 5 );
	}
}

int main( int argc, char *argv[] ){
	wallTrace = (double *)malloc( sizeof(double) * 320 );
	block = ( Object *)malloc( sizeof( Object ));
	block->dim.x = 600; block->dim.y = 250;
	block->dim.w = 30; block->dim.h = 150;

	SDL_Init(SDL_INIT_VIDEO);
	window = SDL_CreateWindow(
        "RACKET",
        SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED,
        640, 480,
        SDL_WINDOW_SHOWN | SDL_WINDOW_OPENGL);

	renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED);

	brick = load_texture( "images/brick.bmp");
	ivy = load_texture( "images/ivy.bmp");
	vend = load_texture( "images/vend.bmp");
	bad = load_texture( "images/bad.bmp");

	//if( back == 0)
		//printf( "%s\n", SDL_GetError() );

	if( renderer && window ){
		printf("Video Initialized!\n");
	}

	main_loop();

	free( block );
	free( wallTrace );
	SDL_DestroyTexture(vend);
	SDL_DestroyTexture(bad);
	SDL_DestroyTexture(ivy);
	SDL_DestroyTexture( brick );
	SDL_DestroyRenderer(renderer);
  SDL_DestroyWindow(window);
    SDL_Quit();

    return 0;
}
