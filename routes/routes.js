var stats = require('../stats/players');

module.exports = (app) => {

    app.post("/", (req, res) => {

    req.body.name = stats.randomNewbName();

  

    stats.players.push(req.body);

    stats.getPlayers();

    //stats.getPlayers();
    res.json(req.body);

  })

  app.post("/signoff", (req, res) => {

    stats.playerLeave( req.body.name );
    res.end();

  })
}
