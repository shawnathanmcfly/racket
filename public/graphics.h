#ifndef _GRAPHICS_H
#define _GRAPHICS_H

#define PI  3.14159265358979323846264338327950288

//*********************************
//****** GLOBAL VALUES ************
//*********************************
//Sorry, big no no
double wallTrace[320];
int traceCnt = 0;

//Main window and renderer
SDL_Window *window = 0;
SDL_Renderer *renderer = 0;

SDL_Rect src;
SDL_Rect dest;

SDL_Texture *brick = 0, *ivy = 0, *vend = 0, *old_wall = 0;

SDL_Texture *load_texture( char *path ){

	SDL_Surface *temp_surf;
	SDL_Texture *texture;

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

		return 1;
	}else{
		printf("Couldn't Initialize Video.");
		return 0;
	}
}

void graphics_rem(){

	SDL_DestroyTexture( vend );
	SDL_DestroyTexture( old_wall );
	SDL_DestroyTexture( ivy );
	SDL_DestroyTexture( brick );

	SDL_DestroyRenderer( renderer );
  SDL_DestroyWindow( window );
  SDL_Quit();
}

#endif
