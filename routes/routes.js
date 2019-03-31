var stats = require('../stats/players');

module.exports = (app) => {

    app.post("/", (req, res) => {

    req.body.name = stats.randomNewbName();
    req.body.lc = 0;

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
    let newMsgs;
    for( let i in stats.players ){

      if( stats.players[i].name === req.body.name ){
        stats.players[i].x = req.body.x;
        stats.players[i].y = req.body.y;
        stats.players[i].r = req.body.r;

        if( stats.players[i].lc < stats.chat.length ){

          newMsgs = stats.chat.slice( stats.players[i].lc );
      
          stats.players[i].lc += stats.chat.length - stats.players[i].lc;
          res.send( newMsgs );
        }else
          res.json(0);

        break;
      }
    }
  });

  app.post("/signoff", (req, res) => {

    stats.playerLeave( req.body.name );


  })

  app.post('/chat', (req, res) => {
    stats.chat.push( req.body );

    res.sendStatus(200);
  })

  app.get('/log', (req, res) => {
    res.json( stats.players );
  })
}
