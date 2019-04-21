var socket, pList = {}, hitList = {}, effectsList = [],
  spawnPoints = [], bullList = [], me = {}, ohShit = undefined;

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
    y:t[1]
  });

  me.dam = 100;
  socket.emit( 'change_sprite', { st:1 } );
  $("#health").text( "" + 100 );
}

//If lc prop == 0, remove it from effects list
function process_effects(){
  for( let i = 0; i < effectsList.length; i++ ){
    if( --effectsList[i].lc <= 0 ){
      effectsList.splice( i, 1 );
      continue;
    }else{

      switch( effectsList[i].st ){
        case 9:
          effectsList[i].z += 12;
          effectsList[i].x += effectsList[i].xs;
          effectsList[i].y += effectsList[i].ys;
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

//Check if bitscanned weapon is aligned with other players in
//screen.
function sendHit(){
  for( let i in hitList ){
    if( hitList[i].x < 640 / 2 &&
      hitList[i].x + hitList[i].w > 640 / 2 && pList[i].st )
        socket.emit( 'send_hit', { id:i, sid: socket.id,
          dam:6, dir:Module._get_player_r() });
  }
}

function sendMsg(){
  if( $("#f-send-msg").val() != '' ){
    socket.emit( 'msg_update', {name:me.name, msg:": " + $("#f-send-msg").val() });
    $("#f-send-msg").val('');
  }
}

//*************************************
//  JAVASCRIPT Portion of main Loop. Its called
//  each frame from main_loop() in C code. See
//  RACKET.C for details
//  This is called from C to maintain a 60FPS
//  Game GLOBALLY
//
//*************************************
function updateScreen(){
    //Get player data in game
    for( let i in pList ){
      pList[i].id = i; //wut
      pList[i].d = Module._get_dist(
        Module._get_player_x(), Module._get_player_y(),
        pList[i].x, pList[i].y
      );
    }

    //Check for blood effects to be drawn
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
          life: 200
        });
        sendSound( 3, 3 );
        Module._play_sound( 3, 3 );
        bullList.splice( i, 1);
        continue;
      }
    }

    //loop through rats array and adjust health and
    //remove if life span is reached
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
          st: 9,
          lc: 20
        });
      }

      if( me.dam <= 0 ){
        socket.emit( 'change_sprite', { st:0 } );
        socket.emit( 'send_frag', { id: me.rats[i].id });
        Module._set_dead();
        me.st = 0;
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

      //Add sprite position on GUI for hit detection
      hitList[ mappedPlayers[i].id ] = {
        x: Module._get_hit_x(t),
        w: Module._get_hit_w(t)
      }
    }

    //When player is hit with electro gun, eject them
    //relative to opp direct until wall contact
    if( ohShit != undefined ){
      let i = 0, splat = false;
      //do a pixel precision check for a wall
      for( i = 0; i < 300; i++ )
        if( Module._wall_hit(
          Module._get_player_x() + Math.cos( ohShit.d ) * i,
          Module._get_player_y() + Math.sin( ohShit.d ) * i ) ){
            i -= 20;
            splat = true;
            break;
        }

      me.x = Module._get_player_x() + Math.cos( ohShit.d ) * i;
      me.y = Module._get_player_y() + Math.sin( ohShit.d ) * i;
      //...then set locally
      Module._set_player_x( me.x );
      Module._set_player_y( me.y );
      //Update player position GLOBALLY
      socket.emit( 'update_position',
        {id:socket.id, x:me.x, y:me.y, r:me.r});

      //Set "Splattered against wall" state for
      //player LOCALLY
      if( splat ){
        socket.emit( 'change_sprite', { st:15 } );
        socket.emit( 'send_frag', { id: ohShit.sid });

        //lol
        for( let ii = 0; ii < 3.14; ii += 0.3925 ){
          socket.emit( 'effects', {
            x:Module._get_player_x(),
            y:Module._get_player_y(),
            xs:Math.cos( (ohShit.d - 1.57) + ii ) * 10,
            ys:Math.sin( (ohShit.d - 1.57) + ii ) * 10,
            z: -150,
            st:9,
            lc: 20
          });
        }


        Module._set_dead();
        ohShit = undefined;
        me.st = 0;
        rats = [];
        sendSound(4, 3);

      }
    }

    //C CALL - check for GUI effects and draw
    Module._process_gui();

    //Got rats eating you? Draw them on your GUI
    for( let i = 0; i < me.rats.length; i++ )
      Module._draw_rat_on_face( me.rats[i].xFace, me.rats[i].yFace );

}

$(

  socket = io.connect(),

  socket.on('connect', function() {
    me = {
      dam: 0,
      frags: 0,
      rats: [],
      x: 0,
      y: 0,
      st: 1,
      id: 0,
      name: ""
    }

    //Send new player data to be added to player list GLOBALLY
    socket.emit( 'add_player', me, function(data){
      me = data;
    });
  }),

  //After respawn or inital game join, send data to all
  //other players for proper drawing position
  socket.on( 'player_join', function(){
    socket.emit( 'update_position', { id:socket.id,
      x:Module._get_player_x(),
      y:Module._get_player_y(),
      r:Module._get_player_r(),
    });
    socket.emit( 'msg_update', {name:me.name, msg:" joined the game!" });
  }),

  socket.on( 'add_player', function(data){
    pList[ data.id ] = data;
    socket.emit( 'send_data_to_new_player', { id:socket.id, data:data });
  }),

  //Sent out when player joins the game for correct
  //position drawing in clients view
  socket.on( 'send_data_to_new_player', function(data){
    pList[ data.id ] = data.data;
  }),

  //...OH SHIT
  socket.on( 'send_electro_hit', function(data){
    if( data.id === socket.id && me.st != 15 )
      ohShit = data;
  }),

  //For bit-scanned pistol hit detection
  socket.on( 'send_hit', function(data){
    if( data.id === socket.id && me.dam > 0 ){
      me.dam -= data.dam;
      socket.emit( 'effects', {
        x:Module._get_player_x(),
        y:Module._get_player_y(),
        xs:Math.cos( data.d + 0.25 ) * 10,
        ys:Math.sin( data.d + 0.25 ) * 10,
        z: -150,
        st:9,
        lc: 20
      });
      //After a hit, check your health to see if yo' dead
      if( me.dam <= 0 ){

        socket.emit( 'change_sprite', { st:0 } );
        Module._set_dead();
        me.st = 0;
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

  //Add new effects and it's type to effects array for
  //processing
  socket.on( 'effects', function(data){
    data.d = Module._get_dist(
        Module._get_player_x(), Module._get_player_y(),
        data.x, data.y
      ) - 4;
    effectsList.push(data);
  }),

  socket.on( 'send_bullet', function(data){
    bullList.push( data );
  }),

  socket.on( 'player_coord', function(data){
    pList[ data.id ] = data.data;
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

  //When player is killed by YOU, match id for
  //client frag update
  socket.on( 'send_frag', function(data){
    if( data.id === socket.id ){
      socket.emit( 'update_position', {id:socket.id , x:me.x, y:me.y, r:me.r});
      ++me.frags;
      $("#frags").text( me.frags );
    }
  }),

  //Update GLOBALLY your direction of facing.
  //So correct directional sprite is drawn
  socket.on( 'send_rot', function(data){
    pList[ data.id ].r = data.data;
  }),

  //Play sound GLOBALLY. Check distance of source also
  //Further away from sound source decreases dedicated
  //channel
  socket.on( 'play_sound', function(sound){
    let soundAdjust;

    soundAdjust = Module._get_dist(
      Module._get_player_x(), Module._get_player_y(),
      sound.x, sound.y);

    soundAdjust = 20 / soundAdjust * 177;
    if( soundAdjust > 20 )
      soundAdjust = 20;

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
        $("#error").remove();
        if( !data ){
          $("#sign-in").prepend("<p style='color:red' id='error'>You made an error somewhere</p>");
        }else{

          $("#sign-in").prepend("<p style='color:green' id='error'>Welcome back " + data.user + "!</p>");
          socket.emit( 'msg_update', {name:me.name, msg:" logged in as " + data.user });
          me.name = data.user;
        }
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
          $("#error").remove();
          $("#register").find('#error').val(" ");
          if( !data ){
            $("#register").prepend("<p style='color:red' id='error'>That name is taken</p>");
          }else{
            $("#register").prepend("<p style='color:green' id='error'>Welcome to RACKET " + data.user.user + "!</p>");
            socket.emit( 'msg_update', {name:me.name, msg:" signed up as " + data.user.user + "! Wish them a warm welcome, with bullets!" });
            me.name = data.user.user;
          }
        })

      }else
        $("#register").append("<p style='color:red' id='error'>Passwords do no match</p>");

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
