#ifndef _GUI_H
#define _GUI_H

#define NUM_GUI_SPRITES 2
////////////////////////
#define GUI_CHAT 0

#define GUI_PISTOL 1

int type_mode = 0;

Sprite *gui_list[2];

void load_gui_sprites(){

  gui_list[GUI_CHAT] = load_sprite("images/gui_chat.bmp");
  gui_list[GUI_PISTOL] = load_sprite("images/pistol.bmp");
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

  //draw pistol sprite in view
  dest.x = 300 - (gui_list[GUI_PISTOL]->w >> 1); dest.y = 480 - (gui_list[GUI_PISTOL]->h << 1);
  dest.w = gui_list[GUI_PISTOL]->w << 1; dest.h = gui_list[GUI_PISTOL]->h << 1;
  SDL_RenderCopy( renderer, gui_list[GUI_PISTOL]->t, NULL, &dest);

}
#endif
