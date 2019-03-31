#ifndef _GUI_H
#define _GUI_H

#define NUM_GUI_SPRITES 1
////////////////////////
#define GUI_CHAT 0

int type_mode = 0;

Sprite *gui_list[1];

void load_gui_sprites(){

  gui_list[GUI_CHAT] = load_sprite("images/gui_chat.bmp");
}

void dest_gui_sprites(){
  for( int i = 0; i < NUM_GUI_SPRITES; i++ )
    free( gui_list[i] );
}

EMSCRIPTEN_KEEPALIVE
void process_gui(){

  if( type_mode ){
    dest.x = 5; dest.y = 475 - gui_list[GUI_CHAT]->h;
    dest.w = gui_list[GUI_CHAT]->w; dest.h = gui_list[GUI_CHAT]->h;
    SDL_RenderCopy( renderer, gui_list[GUI_CHAT]->t, NULL, &dest);
  }
}

#endif
