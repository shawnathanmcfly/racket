
module.exports = {

  players : [],

  chat: [],

  pList: {},

  newbNames: [
      "Newbard Dreyfuss",
      "Sir Spanks Alot",
      "Im Carrying The Team",
      "Duke Cuckem",
      "A Zima Pleze",
      "SafeZone1990",

      //Reserved for Travis Achimasi
      "ChinUpper",
      "Nose Pointer",

  ],

  getPlayers : function(){
    return this.players;
  },

  randomNewbName: function(){
    let select, found = true, playerId;

    do{
      select = this.newbNames[ Math.floor((Math.random() * this.newbNames.length ))];
      found = false;

      if( this.players.length > 0 ){
        for( let i in this.players ){
          if( select === this.players[i].name )
            found = true;
        }
      }
    }while( found );

    //assign in game id
    found = true;
    do{
      playerId = Math.floor((Math.random() * 1000000 ));
      found = false;

      if( this.players.length > 0 ){
        for( let i in this.players ){
          if( playerId === this.players[i].id )
            found = true;
        }
      }
    }while( found )

    return { id: playerId, sel: select };
  },

  playerLeave : function(playername){
    for( let i in this.players ){
      if( this.players[i].name === playername ){
        this.players.splice( i, 1 );
        console.log( playername + " left the server." );
      }
    }
  }
}