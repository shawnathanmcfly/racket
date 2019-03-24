#ifndef _JSFUNCS_H
#define _JSFUNCS_H

EM_JS( void, send_player_data, (double x, double y, double r ), {
  sendPlayerData( x, y, r );
})

EM_JS( void, player_data_from_server, (), {

  getPlayerData();

});

EM_JS( void, player_data_to_server, (double x, double y, double r), {
  getPlayerStat( x, y, r );
});


#endif
