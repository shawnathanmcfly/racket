var socket, pList = {}, hitList = {}, effectsList = [], spawnPoints = [];
var bullList = [];
var me;

var BLOOD_SHOT = 2;

function addSpawnPoint( x, y ){
  spawnPoints.push([x, y]);
}

function setRandomSpawn(){

  let t = spawnPoints[ Math.floor(Math.random() * (spawnPoints.length - 1)) ];
  Module._set_player_x( t[0] );
  Module._set_player_y( t[1] );

  socket.emit( 'update_position', {
    id:socket.id,
    x:t[0],
    y:t[1],
    r:0
  });
  socket.emit( 'change_sprite', { st:0 } );
  me.dam = 100;
  $("#health").text( Math.round( me.dam ) );
  me.st = 0;
}

//If lc prop == 0, remove it from effects list
function process_effects(){

  for( let i = 0; i < effectsList.length; i++ ){
    if( --effectsList[i].lc <= 0 ){
      effectsList.splice( i, 1 );
      continue;
    }else{

      switch( effectsList[i].st ){
        case 2:
          effectsList[i].z += 12;
          break;
        default:
          break;
      }
    }
  }
}

function sendSound( snd, channel ){
  socket.emit( 'play_sound', {
    snd:snd,
    channel:channel,
    x:Module._get_player_x(),
    y:Module._get_player_y(),
  });
}

function sendHit(){

  for( let i in hitList ){
    if( hitList[i].x < 640 / 2 &&
      hitList[i].x + hitList[i].w > 640 / 2 && pList[i].st != 1)
        socket.emit( 'send_hit', { id:i, sid: socket.id, dam:6 });

  }
}

function sendMsg(){
  if( $("#f-send-msg").val() != '' ){
    socket.emit( 'msg_update', {name:me.name, msg:": " + $("#f-send-msg").val() });
    $("#f-send-msg").val('');
  }
}

function updateScreen(){
    //add distance to player from objects in server

    for( let i in pList ){
      pList[i].id = i; //wut
      pList[i].d = Module._get_dist(
        Module._get_player_x(), Module._get_player_y(),
        pList[i].x, pList[i].y
      );
    }

    process_effects();

    //sort effects drawing order by distance
    effectsList.sort( function(a, b){
      return b.d - a.d;
    });

    //Sort objects for ordered drawing
    const mappedPlayers = Object.keys(pList).map( i => pList[i] )
      .sort(function (a, b) {
          return b.d - a.d;
    });

    //draw background
    Module._draw_back( 0 );

    //cast rays
    Module._cast_rays();

    for( let i = 0; i < bullList.length; i++ ){
      let distance;
      bullList[i].x += bullList[i].sx;
      bullList[i].y += bullList[i].sy;

      if( bullList[i].x > 18 * 200 ||  bullList[i].x < 200 ||
          bullList[i].y > 19 * 200 ||  bullList[i].y < 200 ){

            bullList.splice( i, 1);
            continue;
      }

      distance = Module._get_dist(
        Module._get_player_x(), Module._get_player_y(),
        bullList[i].x, bullList[i].y);

      Module._draw_sprite(
        bullList[i].x,
        bullList[i].y,
        bullList[i].z,
        0,
        distance,
        bullList[i].st
      );

      if( distance <= 100 && bullList[i].id != socket.id && me.dam > 0 ){
        me.rats.push( {id: bullList[i].id,
          xFace: Math.floor(Math.random() * 640),
          yFace: Math.floor(Math.random() * 480),
          life: 120
        });
        sendSound( 3, 3 );
        Module._play_sound( 3, 3 );
        bullList.splice( i, 1);
        continue;
      }
    }

    for( let i = 0; i < me.rats.length; i++ ){

      me.dam -= 0.10;
      $("#health").text( Math.round( me.dam ) );

      if( --me.rats[i].life <= 0 ){
        me.rats.splice( i, 1 );
        continue;
      }

      if( me.dam % 10 == 0 ){
        socket.emit( 'effects', {
          x:Module._get_player_x() + (me.dam >> 1),
          y:Module._get_player_y() + (me.dam >> 1),
          z: -(200+me.dam),
          st:BLOOD_SHOT,

        });
      }

      if( me.dam <= 0 ){
        socket.emit( 'change_sprite', { st:1 } );
        socket.emit( 'send_frag', { id: me.rats[i].id });
        Module._set_dead();
        me.st = 1;
        sendSound( 1, 3 );
        me.rats = [];
        break;
      }

    }

    //Draw Sprites from furthest to closest.
    //(Avoid overlapping)
    for( let i = 0; i < mappedPlayers.length; i++ ){
      let t;

      t = Module._draw_sprite(
        mappedPlayers[i].x,
        mappedPlayers[i].y,
        0,
        mappedPlayers[i].r,
        mappedPlayers[i].d,
        mappedPlayers[i].st
      )

      //Also draw effects
      if( i < effectsList.length ){
        Module._draw_sprite(
          effectsList[i].x,
          effectsList[i].y,
          effectsList[i].z,
          effectsList[i].r,
          effectsList[i].d,
          effectsList[i].st
        );
      }

      //Add sprite position to hit detection list
      hitList[ mappedPlayers[i].id ] = {
        x: Module._get_hit_x(t),
        w: Module._get_hit_w(t)
      }
    }
    Module._process_gui();

    for( let i = 0; i < me.rats.length; i++ )
      Module._draw_rat_on_face( me.rats[i].xFace, me.rats[i].yFace );

}

$(

  socket = io.connect(),

  socket.on( 'send_init_info', function(data){
    pList[ data.id ] = data.data;
  }),

  socket.on('connect', function() {
    var newPlayer = { st:0,
      x:600, y:600, r:3.12 }
    socket.emit( 'add_player', newPlayer, function(data){

      //setup initial player data
      me = data;
      //let the other clients know of this
      socket.emit( 'msg_update', {name:me.name, msg:" connected."});
    });
  }),

  socket.on( 'send_hit', function(data){
    if( data.id === socket.id && me.dam > 0 ){
      me.dam -= data.dam;
      socket.emit( 'effects', {
        x:Module._get_player_x(),
        y:Module._get_player_y(),
        z: -100,
        st:BLOOD_SHOT,

      });
      if( me.dam <= 0 ){

        socket.emit( 'change_sprite', { st:1 } );
        Module._set_dead();
        me.st = 1;
        sendSound( 1, 3 );
        socket.emit( 'send_frag', { id: data.sid });
      }
      $("#health").text( Math.round( me.dam ) );
    }
  }),

  socket.on( 'update_position', function(data){
    if( data ){
      pList[ data.id ].x = data.x;
      pList[ data.id ].y = data.y;
      pList[ data.id ].r = data.r;
    }
  }),

  socket.on( 'effects', function(data){
    data.lc = 8;
    data.d = Module._get_dist(
        Module._get_player_x(), Module._get_player_y(),
        data.x, data.y
      ) - 10;
    effectsList.push(data);

  }),

  socket.on( 'send_bullet', function(data){
    bullList.push( data );
  }),

  socket.on( 'player_coord', function(data){
    pList[ data.id ] = data.data;
  }),

  socket.on( 'add_player', function(data){
    pList[ data.id ] = data.data;
    socket.emit('send_init_info', { id: socket.id, data:me} );
  }),

  socket.on( 'player_disconnect', function(data){
    delete pList[data];
  }),

  socket.on( 'msg_update', function(data){
    $("#f-main").append("<span style='color:white;font-size:15px'>" + data.name + "</span><span style='color:gray'>" + data.msg + "</span><br>");
    $("#f-main").scrollTop($("#f-main").prop("scrollHeight"));
  }),

  socket.on( 'change_sprite', function(data){
    pList[ data.id ].st = data.st;
  }),

  socket.on( 'send_frag', function(data){
    if( data.id === socket.id ){
      ++me.frags;
      $("#frags").text( me.frags );
    }
  }),

  socket.on( 'play_sound', function(sound){
    let soundAdjust;

    soundAdjust = Module._get_dist(
      Module._get_player_x(), Module._get_player_y(),
      sound.x, sound.y);

    soundAdjust = 40 / soundAdjust * 277;
    if( soundAdjust > 40 )
      soundAdjust = 40

    Module._mix_volume( soundAdjust, sound.channel );
    Module._play_sound( sound.snd, sound.channel );
  }),

  $(document).on( "submit", "#sign-in", function(e){
    e.preventDefault();
    $.post('/signin', {
        user: $("#user").val(),
        pass: $("#pass").val(),
        old: me.name
      }, function( data ){
        $("#error").val('');
        if( !data ){
          $("#sign-in").prepend("<p id='error'>You made an error somewhere</p>");
        }else
          me.name = data.user;
      })
      $("#user").val(''),
      $("#pass").val(''),
      Module._type_mode_off();
  }),

  $(document).on( "submit", "#register", function(e){
    e.preventDefault();

    if( $("#sign-pass").val() === $("#sign-pass-conf").val() ){

      $.post('/register', {
          user: $("#sign-user").val(),
          pass: $("#sign-pass").val(),
          old: me.name
        }, function( data ){

          $("#register").find('#error').remove();

          if( !data ){
            $("#register").prepend("<p id='error'>That name is taken</p>");

          }else
            me.name = data.user.user;
        })

      }else
        $("#register").prepend("<p id='error'>Passwords do no match</p>");

    $("#sign-user").val('');
    $("#sign-pass").val('');
    $("#sign-pass-conf").val('');
    Module._type_mode_off();
  }),

  $(document).on( "click", "#f-send-msg", function(){
    Module._set_location( 0 );
  }),

  $(document).on( "click", "#user", function(){
    Module._set_location( 1 );
  }),

  $(document).on( "click", "#pass", function(){
    Module._set_location( 2 );
  }),

  $(document).on( "click", "#sign-user", function(){
    Module._set_location( 3 );
  }),

  $(document).on( "click", "#sign-pass", function(){
    Module._set_location( 4 );
  }),

  $(document).on( "click", "#sign-pass-conf", function(){
    Module._set_location( 5 );
  })
)
