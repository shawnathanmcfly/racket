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
     data.dam = 100;
     data.frags = 0;
     data.rats = [];
     data.x = 0;
     data.y = 0;
     data.st = 1;
     data.id = socket.id;
     data.name = stats.randomNewbName();
     socket.broadcast.emit( 'add_player', data);
     cb(data);
   });

   socket.on( 'player_join', function(){
     socket.broadcast.emit('player_join');
   });

   socket.on( 'send_data_to_new_player', function(data){
     socket.broadcast.emit( 'send_data_to_new_player', data );
   });

   //update all clients on players postion and rotation
   socket.on('player_coord', function(data){
    
    socket.broadcast.emit('player_coord', { id:socket.id, data:data });
   });

   socket.on( 'send_frag', function(data){
     socket.broadcast.emit( 'send_frag', data );
   });

   socket.on('send_bullet', function(data){
     io.emit('send_bullet', data );
   });

   //send new message data to all clients. Including sending client.
   socket.on('msg_update', function(data){
     io.emit('msg_update', data );
   });

   socket.on('disconnect', function(){
     io.emit( 'player_disconnect', socket.id );
   });

   socket.on('send_hit', function(data ){
      socket.broadcast.emit( 'send_hit', data );
   });

   socket.on( 'update_position', function(data){
     socket.broadcast.emit( 'update_position', data );
   });

   socket.on('play_sound', function(data){
     socket.broadcast.emit( 'play_sound', data );
   });

   socket.on('effects', function(data){
     socket.broadcast.emit( 'effects', data );
   });

   socket.on('change_sprite', function(data){
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
