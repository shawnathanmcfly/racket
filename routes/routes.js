var stats = require('../stats/players');

module.exports = (app) => {

    app.post("/", (req, res) => {

    req.body.name = stats.randomNewbName();

    console.log( req.body.name + " joined the game!" );

    stats.players.push(req.body);

    stats.getPlayers();

    res.json(req.body);

  })

  app.post("/signoff", (req, res) => {

    stats.playerLeave( req.body.name );
    res.end();

  })
}
