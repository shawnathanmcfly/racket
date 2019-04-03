var stats = require('./players');

module.exports = (app) => {

    app.post("/", (req, res) => {
    let t;
    t = stats.randomNewbName();
    req.body.name = t.sel;
    req.body.id = t.id;
    req.body.lc = 0;

    stats.pList[t.id] = { dam: 0 };

    stats.chat.push({ user:"-", msg: req.body.name + " joined the game!" })

    stats.players.push(req.body);

    console.log( "*ONLINE PLAYERS*" );
    for( let i in stats.players ){
      console.log( stats.players[i] );
    }

    res.json(req.body);

  })

  app.get( "/data/:pid", (req, res) => {
    let pd, dam;
    pd = stats.players;
    dam = stats.pList[req.params.pid].dam;
    stats.pList[req.params.pid].dam = 0;
    res.json( {pd: pd, dam:dam} );
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
          res.end();

        break;
      }
    }
  });

  app.post("/signoff", (req, res) => {
    stats.chat.push({ user: "", msg: "" + req.body.name + " left the game!"})
    stats.playerLeave( req.body.name );
    res.end();
  })

  app.post('/chat', (req, res) => {
    stats.chat.push( req.body );

    res.sendStatus(200);
  })

  app.get('/log', (req, res) => {
    res.json( stats.players );
  })

  app.post("/hit", (req, res) => {
    stats.pList[req.body.id].dam = req.body.dam;
    res.end();
  })
}
