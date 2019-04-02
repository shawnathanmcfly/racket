#ifndef _RAY_H
#define _RAY_H

#define PI  3.14159265358979323846264338327950288

//Cast ray in selected position
void cast_ray( double offset, int col_pos ){

  int y_start = floor(player_y / CUBE_SIZE) * CUBE_SIZE - 1, x_start, ca = 0;
	double step_y, step_x, vh, hh, hl, vl, hc, vc;

	if( offset > 2 * 3.14 )
		offset -= 2 * 3.14;

	if( offset < 0 )
		offset += 2 * 3.14;

	//horizontal check
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

	hl = sqrt( (player_x - x_start) * (player_x - x_start) +
    (player_y - y_start) * (player_y - y_start) );

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

		dest.h = (int)CUBE_SIZE / floor( vl * (cos( (offset - rot) - PI / 1080 )) ) * 577;
		dest.y = 240 - dest.h / 2;
		src.x = vh;

    wallTrace[traceCnt] = vl;

      ca = 20000 / vl;
		if( vc == 1 ){
      SDL_SetTextureColorMod(brick, ca, ca, ca);
			SDL_RenderCopy( renderer, brick, &src, &dest);
		}else if( vc == 2){
      SDL_SetTextureColorMod(ivy, ca, ca, ca);
			SDL_RenderCopy( renderer, ivy, &src, &dest);
		}else if( vc == 3 ){
      SDL_SetTextureColorMod(vend, ca, ca, ca);
			SDL_RenderCopy( renderer, vend, &src, &dest);
    }else if( vc == 4 ){
      SDL_SetTextureColorMod(old_wall, ca, ca, ca);
			SDL_RenderCopy( renderer, old_wall, &src, &dest);
    }


	}else{

		dest.h = (int)CUBE_SIZE / floor( hl * (cos( (offset - rot) - PI / 1080 )) ) * 577;
		dest.y = 240 - dest.h / 2;
		src.x = hh;

		wallTrace[traceCnt] = hl;
    ca = 20000 / hl;
    if( hc == 1 ){
      SDL_SetTextureColorMod(brick, ca, ca, ca);
			SDL_RenderCopy( renderer, brick, &src, &dest);
		}else if( hc == 2){
      SDL_SetTextureColorMod(ivy, ca, ca, ca);
			SDL_RenderCopy( renderer, ivy, &src, &dest);
		}else if( hc == 3 ){
      SDL_SetTextureColorMod(vend, ca, ca, ca);
			SDL_RenderCopy( renderer, vend, &src, &dest);
    }else if( hc == 4 ){
      SDL_SetTextureColorMod(old_wall, ca, ca, ca);
			SDL_RenderCopy( renderer, old_wall, &src, &dest);
    }
	}
}

EMSCRIPTEN_KEEPALIVE
void cast_rays( ){
	//right half of view
	double offset = 0, dist;
	int slice = 640 / 2;
  traceCnt = 320 / 2;
	for( int i = 0; i < 160; i++, offset += 3.14 / 1080, slice += 2, traceCnt++ )
		cast_ray( rot + offset, slice );

	/*left check of view*/
	offset = -1 * 3.14 / 1080;
	slice = 640 / 2;
  traceCnt = 320 / 2;
	for( int i = 0; i < 160; i++, offset -= 1 * 3.14 / 1080, slice -= 2, traceCnt-- )
		cast_ray( rot + offset, slice );

}

#endif
