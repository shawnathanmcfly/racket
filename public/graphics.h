#ifndef _GRAPHICS_H
#define _GRAPHICS_H

#define PI  3.14159265358979323846264338327950288

//Main window and renderer
SDL_Window *window = 0;
SDL_Renderer *renderer = 0;

double adjust = 0;

SDL_Rect src;
SDL_Rect dest;
SDL_Rect fillrect;

SDL_Texture *brick = 0, *ivy = 0, *vend = 0, *old_wall = 0;
SDL_Texture *bad = 0;

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

int graphics_init(){

	SDL_Init(SDL_INIT_VIDEO);
	window = SDL_CreateWindow(
        "RACKET",
        SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED,
        640, 480,
        SDL_WINDOW_SHOWN | SDL_WINDOW_OPENGL
			);
	renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED);

	//Make sure renderer and window were Initialized
	if( renderer && window ){
		printf("Video Initialized!\n");

		//Wall textures
		brick = load_texture( "images/brick.bmp");
		old_wall = load_texture( "images/old_wall.bmp");
		ivy = load_texture( "images/ivy.bmp");
		vend = load_texture( "images/vend.bmp");

		//Sprites
		bad = load_texture( "images/bad.bmp");

		return 1;
	}else{
		printf("Couldn't Initialize Video.");
		return 0;
	}
}

void graphics_rem(){

	SDL_DestroyTexture( vend );
	SDL_DestroyTexture( bad );
	SDL_DestroyTexture( old_wall );
	SDL_DestroyTexture( ivy );
	SDL_DestroyTexture( brick );

	SDL_DestroyRenderer( renderer );
  SDL_DestroyWindow( window );
  SDL_Quit();
}

void draw_object( double x, double y, double r ){
	double d, object_angle, player_angle, adjust;

	d = sqrt( (player_x - x) * (player_x - x) +
		(player_y - y) * (player_y - y) );

  fillrect.w = 30 / d * 577;
	fillrect.h = 90 / d * 577;

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

	fillrect.x = ((640 / 2) - (fillrect.w/2)) + (object_angle - player_angle) * 12;
	fillrect.y = 240 - (90 / d);

	//printf("object drawing");
	SDL_RenderCopy( renderer, bad, NULL, &fillrect);
}

EMSCRIPTEN_KEEPALIVE
void draw_objects( double *list, int size ){

	for( int i = 0; i < size; i+=3 ){
		//printf("%f - %f - %f\n", list[i], list[i+1], list[i+2]);
		draw_object( list[i], list[i+1], list[i+2] );

	}

}

#endif
