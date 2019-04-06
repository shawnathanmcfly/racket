var socket, pList = {};
var me;

function sendHit( id, dam ){

}

function sendMsg(){
  if( $("#f-send-msg").val() === '' )
    $("#f-send-msg").val("I'm sending empty string cuz I'm cool.");
  socket.emit( 'msg_update', {name:me.name, msg:$("#f-send-msg").val() });
  $("#f-send-msg").val('');
}

function sendPlayerData( x, y, r ){

  me.x = x; me.y = y; me.r = r;
  socket.emit( 'player_coord', me );
  //$("#f-main").scrollTop($("#f-main").prop("scrollHeight"));
}

function getPlayerData(){

      //set typed array to pass to C function
      //negate 1 to skip yourself from rendering
      const arr = new Float64Array( Object.keys(pList).length * 6 );
      let buff;

      //add distance to player from objects in server
      for( let i in pList ){
        pList[i].d = Module._get_dist(
          Module._get_player_x(), Module._get_player_y(),
          pList[i].x, pList[i].y
        );
      }

      //Sort objects for ordered drawing
      const mappedPlayers = Object.keys(pList).map( i => pList[i] )
        .sort(function (a, b) {
            return b.d - a.d;
      });

      //console.log( mappedPlayers );

      for( let i = 0; i < mappedPlayers.length; i++ ){

        arr[i*6] = mappedPlayers[i].x;
        arr[i*6+1] = mappedPlayers[i].y;
        arr[i*6+2] = mappedPlayers[i].r;
        arr[i*6+3] = mappedPlayers[i].d;
        arr[i*6+4] = mappedPlayers[i].st;
        arr[i*6+5] = 0 //mappedPlayers[i].id;
      }

      //allocate space in virtual heap for pointer algorithm in C
      buff = Module._malloc( arr.length * arr.BYTES_PER_ELEMENT );
      Module.HEAPF64.set( arr, buff >> 3 );
      Module._cast_rays();
      Module._draw_sprites( buff, arr.length );
      Module._process_gui();
      Module._free( buff );


}

$(
  socket = io.connect(),

  socket.on('connect', function() {
    var pid = socket.id;
    var newPlayer = { id: socket.id, name: "", st:0, x:600, y:600, r:3.12 }
    socket.emit( 'add_player', newPlayer, function(data){
      me = data;
      $("#f-gui").append("<p>HEALTH</p><p id='health'>" + data.dam + "</p>");
      $("#f-main").scrollTop($("#f-main").prop("scrollHeight"));
    })
  }),

  socket.on( 'player_coord', function(data){
    pList[ data.id ] = data.data;
  }),

  socket.on( 'add_player', function( data ){
    pList[ data.id ] = data.data;
  }),

  socket.on( 'player_disconnect', function(data){
    delete pList[data];
  }),

  socket.on( 'msg_update', function(data){
    $("#f-main").append("<p style='color:yellow'>" + data.name + ": " + data.msg + "</p>");
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
        }else{
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
