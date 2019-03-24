var stats = require('../stats/players');

module.exports = (app) => {

    app.post("/", (req, res) => {

    req.body.name = stats.randomNewbName();

    console.log( req.body.name + " joined the game!" );

    stats.players.push(req.body);


    res.json(req.body);

  })

  app.get( "/data", (req, res) => {

    res.json( stats.players );
  })

  app.post("/signoff", (req, res) => {

    stats.playerLeave( req.body.name );
    res.end();

  })
}
