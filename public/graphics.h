#ifndef _GRAPHICS_H
#define _GRAPHICS_H

#define PI  3.14159265358979323846264338327950288

SDL_Window *window = 0;
SDL_Renderer *renderer = 0;
SDL_Rect src;
SDL_Rect dest;
SDL_Rect fillrect;

SDL_Texture *brick = 0, *ivy = 0, *vend = 0, *bad = 0;

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

#endif
