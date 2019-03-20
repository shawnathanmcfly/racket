#ifndef _JSFUNCS_H
#define _JSFUNCS_H

EM_JS( void, player_data_to_server, (double x, double y, double r), {
  getPlayerStat( x, y, r );
});

#endif
