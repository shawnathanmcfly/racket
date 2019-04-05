const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use( express.static("public"));

require( __dirname + '/routes/routes.js')(app);
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/racket";

app.listen( PORT, () => {

    console.log('App listening on: ' + PORT + "!" );
    process.env.SECRET_KEY = "alu1ndra1";
    mongoose.connect( MONGODB_URI, { useNewUrlParser: true });
    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', function(err) {
      console.log("Connection Successful!");
    });

});
