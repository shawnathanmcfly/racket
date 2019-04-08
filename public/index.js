var socket, pList = {}, hitList = {}, effectsList = [];
var me;

var BLOOD_SHOT = 2;

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
  socket.emit( 'play_sound', { snd:snd, channel:channel });
}

function sendHit(){
  for( let i in hitList ){
    if( hitList[i].x < 640 / 2 &&
      hitList[i].x + hitList[i].w > 640 / 2)
        socket.emit( 'send_hit', { id:hitList[i].id, dam:6 });
  }
}

function sendMsg(){
  if( $("#f-send-msg").val() === '' )
    $("#f-send-msg").val("I'm sending an empty string cuz I'm cool.");
  socket.emit( 'msg_update', {name:me.name, msg:$("#f-send-msg").val() });
  $("#f-send-msg").val('');
}

function sendPlayerData( x, y, r ){
  me.x = x; me.y = y; me.r = r;
  socket.emit( 'player_coord', me );
}

function getPlayerData(){
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
      if( i < effectsList.length && effectsList.length ){
        Module._draw_sprite(
          effectsList[i].x,
          effectsList[i].y,
          effectsList[i].z,
          effectsList[i].r,
          effectsList[i].d,
          effectsList[i].st
      );}

      //Add sprite position to hit detection list
      hitList[ mappedPlayers[i].id ] = {
        x: Module._get_hit_x(t),
        w: Module._get_hit_w(t)
      }
    }
    Module._process_gui();
}

$(
  socket = io.connect(),

  socket.on('connect', function() {
    var pid = socket.id;
    var newPlayer = { id: socket.id, name: "", st:0, x:600, y:600, r:3.12 }
    socket.emit( 'add_player', newPlayer, function(data){
      me = data;
      $("#f-gui").append("<p>HEALTH</p><p id='health'>" + 100 + "</p>");
      $("#f-main").scrollTop($("#f-main").prop("scrollHeight"));
    })
  }),

  socket.on( 'send_hit', function(data){
    Module._play_sound( 0 );
    if( data.id === me.id ){
      me.dam -= data.dam;
      socket.emit( 'effects', {
        x:Module._get_player_x(),
        y:Module._get_player_y(),
        z: -100,
        st:BLOOD_SHOT,

      });
      if( me.dam <= 0 ){
        me.dam = 100;
        socket.emit( 'change_sprite', { st:1 } );
        me.st = 1;
        socket.emit( 'play_sound', 1 );
      }
      $("#health").text( "" + me.dam );
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

  socket.on( 'player_coord', function(data){
    pList[ data.id ] = data.data;
  }),

  socket.on( 'add_player', function(data){
    pList[ data.id ] = data.data;
  }),

  socket.on( 'player_disconnect', function(data){
    delete pList[data];
  }),

  socket.on( 'msg_update', function(data){
    $("#f-main").append("<p style='color:yellow'>" + data.name + ": " + data.msg + "</p>");
    $("#f-main").scrollTop($("#f-main").prop("scrollHeight"));
  }),

  socket.on( 'change_sprite', function(data){
    pList[ data.id ].st = data.st;
  }),

  socket.on( 'play_sound', function(sound){
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
          $("#sign-in").prepend("<p id='error'>You fucked up somewhere</p>");
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
            $("#register").prepend("<p id='error'>That name taken nigga</p>");

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
