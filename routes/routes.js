var stats = require('../stats/players');

module.exports = (app) => {

    app.post("/", (req, res) => {

    req.body.name = stats.randomNewbName();
    req.body.gf = 0;

    console.log( req.body.name + " joined the game!" );

    stats.players.push(req.body);

    console.log( "*ONLINE PLAYERS*" );
    for( let i in stats.players ){
      console.log( stats.players[i] );
    }

    res.json(req.body);

  })

  app.get( "/data", (req, res) => {

    res.json( stats.players );
  })

  app.post( "/data", (req, res) => {

    for( let i in stats.players ){

      if( stats.players[i].name === req.body.name ){
        stats.players[i].x = req.body.x;
        stats.players[i].y = req.body.y;
        stats.players[i].r = req.body.r;
        break;
      }
    }

    res.end();
  });

  app.post("/signoff", (req, res) => {

    stats.playerLeave( req.body.name );


  })

  app.get('/chat', (req, res) => {
    res.json( stats.chat );
  })

  app.get('/newchat', (req, res) => {
    res.json( stats.chat[ stats.chat.length - 1 ] );
  })

  app.post('/resetflag', (req, res) => {
    console.log( "restting " + req.body.user );
    for( let i in stats.players ){

      if( stats.players[i].name === req.body.user ){
        stats.players[i].gf = 0;
        console.log( "GAME FLAG RESET: " + stats.players[i].gf );
        break;
      }
    }

    res.end();
  })

  app.post('/chat', (req, res) => {
    stats.chat.push( req.body );
    stats.setAllPlayerFlags( 1, req.body.user );
    setTimeout(function(){ stats.resetAllPlayerFlags( 0, req.body.user ); }, 200);


    res.sendStatus(200);
  })

  app.get('/log', (req, res) => {
    res.json( stats.players );
  })
}
