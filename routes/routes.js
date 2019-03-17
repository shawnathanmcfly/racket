var stats = require('../stats/players');

module.exports = (app) => {

  app.post("/", (req, res) => {

    res.json({ msg: req.body.name +  " joined the game!"});

    stats.players.push(req.body);


    stats.getPlayers();





  })


}
