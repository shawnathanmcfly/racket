var stats = require('../stats/players');
var Racket = require( __dirname + "/../models/users");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = (app) => {
  app.post("/", (req, res) => {


  })

  app.post('/signin', (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
    Racket.findOne({ user: user }, function( err, data ){
        if(!data) return res.status(200).send(null);
        const  result  =  bcrypt.compareSync(pass, data.pass);
        if(!result) return  res.status(200).send(null);
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

}
