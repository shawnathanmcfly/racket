#ifndef _JSFUNCS_H
#define _JSFUNCS_H

EM_JS( void, send_player_data, (double x, double y, double r ), {
  sendPlayerData( x, y, r );
})

EM_JS( void, player_data_from_server, (), {

  getPlayerData();

});

EM_JS( void, player_data_to_server, (double x, double y, double r ), {
  getPlayerStat( x, y, r );
});

EM_JS( void, print_players, (), {
  printPlayers();
});

EM_JS( void, send_char, ( char c ), {
  if( c == 8 ){
    $("#f-send-msg").text(function (_,txt) {
      return txt.slice(0, -1);
    });
  }else
    $("#f-send-msg").append(String.fromCharCode(c));
})

EM_JS( void, list_chat, (), {
  getChat();
})


#endif
