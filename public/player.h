#ifndef _PLAYER_H
#define _PLAYER_H

double player_dir = -1, rot = 3.12, player_x = 600, player_y = 201;

EMSCRIPTEN_KEEPALIVE
double get_player_x(){
  return player_x;
}

EMSCRIPTEN_KEEPALIVE
double get_player_y(){
  return player_y;
}

EMSCRIPTEN_KEEPALIVE
double get_dist( double x1, double y1, double x2, double y2 ){
  return sqrt( (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) );
}


#endif
