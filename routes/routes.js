var stats = require('../stats/players');
var Racket = require( __dirname + "/../models/users");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = (app) => {
    app.post("/", (req, res) => {
      let t = stats.randomNewbName();

      req.body.name = t.sel;
      req.body.id = t.id;
      req.body.lc = 0;
      req.body.dam = 100;

      stats.chat.push({ user:":::", msg: req.body.name + " joined the game!" })
      stats.players.push(req.body);

      res.json(req.body);

    })

  app.get( "/data", (req, res) => {
    res.send( stats.players );
  })

  app.post( "/data", (req, res) => {
    let newMsgs;
    for( let i in stats.players ){
      if( stats.players[i].id == req.body.id ){

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

  app.post('/signin', (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
    Racket.findOne({ user: user }, function( err, data ){
        if(!data) return res.status(200).send(null);
        const  result  =  bcrypt.compareSync(pass, data.pass);
        if(!result) return  res.status(200).send(null);
        stats.changeName( req.body.old, data.user );
        const  expiresIn  =  24  *  60  *  60;
        const  accessToken  =  jwt.sign({ id:  data.id }, process.env.SECRET_KEY, {
            expiresIn:  expiresIn
        });
        res.status(200).send({
          "user":  user,
          "access_token":  accessToken,
          "expires_in":  expiresIn,
        });
    });
  });

  app.post( '/register', (req, res) => {
    const  username  =  req.body.user;
    const  pass  =  bcrypt.hashSync(req.body.pass);

    Racket.findOne({ user: username }, function( err, addUser ){

      if( addUser != null ){
        return res.status(200).send(null);
      }else{

        var newUser = new Racket({ user: username, pass: pass, frags: 0});
        newUser.save( function( err, data) {
          Racket.findOne({ user: username}, (err, user)=>{
            if( err ) res.status(200).send(null);
            const  expiresIn  =  24  *  60  *  60;
            const  accessToken  =  jwt.sign({ id:  user.id }, process.env.SECRET_KEY, {
                expiresIn:  expiresIn
            });

            stats.changeName( req.body.old, username );
            res.status(200).send({
                "user":  user,
                "access_token":  accessToken,
                "expires_in":  expiresIn,
            });
          });
        });
      }
    });
  });

  app.post("/signoff", (req, res) => {
    stats.playerLeave( req.body.name );
    stats.chat.push({ user: ":::", msg: "" + req.body.name + " left the game!"})

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
    for( let i in stats.players ){
      if( stats.players[i].id == req.body.id )
        stats.players[i].dam -= req.body.dam;
    }
    res.end();
  })
}
