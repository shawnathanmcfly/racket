const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const mongoose = require('mongoose');
var stats = require('./stats/players');
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use( express.static("public"));

require( __dirname + '/routes/routes.js')(app);
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/racket";

io.sockets.on('connection',(socket) => {

   //Add player to server when connected
   socket.on( 'add_player', function(data, cb){
     let id = data.id;
     delete data.id;
     data.dam = 100;
     data.name = stats.randomNewbName();
     stats.players[ id ] = data;
     socket.broadcast.emit( 'add_player', { id: id, data:data } );
     cb(data);
   });

   //update all clients on players postion and rotation
   socket.on('player_coord', function(data){
    stats.players[ socket.id ] = data;
    socket.broadcast.emit('player_coord', { id:socket.id, data:data });
   });

   //send new message data to all clients. Including sending client.
   socket.on('msg_update', function(data){
     io.emit('msg_update', data );
   });

   //remove instance of player from server.
   //Also send notification of this for other
   //players can delete the instance from
   //client side data table
   socket.on('disconnect', function(){
     delete stats.players[socket.id];
     io.emit( 'player_disconnect', socket.id );
   });

   socket.on('send_hit', function(data){
     socket.broadcast.emit( 'send_hit', data );
   });

   socket.on('play_sound', function(data){
     io.emit( 'play_sound', data );
   });

   socket.on('effects', function(data){
     socket.broadcast.emit( 'effects', data );
   });

   socket.on('change_sprite', function(data){
     stats.players[ socket.id ].st = data.st;
     data.id = socket.id;
     socket.broadcast.emit( 'change_sprite', data );
   });
});

server.listen( PORT, () => {

    console.log('App listening on: ' + PORT + "!" );
    process.env.SECRET_KEY = "alu1ndra1";
    mongoose.connect( MONGODB_URI, { useNewUrlParser: true });
    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', function(err) {
      console.log("Connection Successful!");
    });

});
