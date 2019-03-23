#ifndef _OBJECTS_H
#define _OBJECTS_H


struct Object {
	int type, w, h;
	double x, y, r;
	int hp;
	SDL_Texture *sprite;
	struct Object *next;
};

struct Object *object_list = 0;
struct Object **cur_object = &object_list;

int load_object( int type, double x, double y,
	double r, int hp, SDL_Texture *sprite ){

	cur_object = &object_list;
	while( *cur_object )
		cur_object = &(*cur_object)->next;

	*cur_object = ( struct Object *)malloc( sizeof( struct Object ));

	if( *cur_object == 0 )
		return 0;

	SDL_QueryTexture( sprite , NULL, NULL, &(*cur_object)->w, &(*cur_object)->h );
	(*cur_object)->type = type;
	(*cur_object)->x = x;
	(*cur_object)->y = y;
	(*cur_object)->r = r;
	(*cur_object)->hp = hp;
	(*cur_object)->sprite = sprite;
	(*cur_object)->next = 0;

	return 1;
}

void destroy_objects(){

	cur_object = &object_list;
	while( *cur_object ){

		free( *cur_object );

    *cur_object = (*cur_object)->next;
	}
}

#endif
