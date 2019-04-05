var playerName = "", pid = 0, health = 0;

//getPlayerStat is called from C to control frame rate
function getPlayerStat( x, y, r ){
  return(
    //////////////////////////////////
    //NOTE: ST is dummy for testing!!!!!
    /////////////////////////////////---|
    $.post("/", { x: x, y: y, r: r, st: 0 }, function(data){
        playerName = data.name;
        pid = data.id;
        health = data.dam;
        $("title").html(playerName);
        $("#f-gui").append("<p>HEALTH</p><p id='health'>" + health + "</p>");
        $("#f-main").scrollTop($("#f-main").prop("scrollHeight"));
    })
  )
}

function sendHit( id, dam ){
  $.post("/hit", { id: id, dam: dam }, function(data){

  })
}

function sendPlayerData( x, y, r ){
  return(
    $.post("/data", {x:x, y:y, r:r, id:pid }, function(data){
      if( data ){
        for( let i in data ){
          $('#f-main').append( "<p>" + data[i].user + ": " + data[i].msg + "</p>")
        }
        $("#f-main").scrollTop($("#f-main").prop("scrollHeight"));
      }
    })
  )
}

function getPlayerData(){
  return(
    $.get("/data", function(data){
      //set typed array to pass to C function
      //negate 1 to skip yourself from rendering
      const arr = new Float64Array( (data.length - 1) * 6 );
      let buff;

      //splice yourself from list, no need to render your own sprite
      //also grab your health data and update on your end
      for( let i in data ){
        if( data[i].id == pid ){
          health = data[i].dam;
          $("#health").text( ""+health );
          delete data[i];
          break;
        }
      }

      //add distance to player from objects in server
      for( let i in data ){
        data[i].d = Module._get_dist(
          Module._get_player_x(), Module._get_player_y(),
          data[i].x, data[i].y
        );
      }

      //Sort objects for ordered drawing
      const mappedPlayers = Object.keys(data).map( i => data[i] )
        .sort(function (a, b) {
            return b.d - a.d;
        });

      for( let i = 0; i < mappedPlayers.length; i++ ){

        arr[i*6] = mappedPlayers[i].x;
        arr[i*6+1] = mappedPlayers[i].y;
        arr[i*6+2] = mappedPlayers[i].r;
        arr[i*6+3] = mappedPlayers[i].d;
        arr[i*6+4] = mappedPlayers[i].st;
        arr[i*6+5] = mappedPlayers[i].id;
      }

      //allocate space in virtual heap for pointer algorithm in C
      buff = Module._malloc( arr.length * arr.BYTES_PER_ELEMENT );
      Module.HEAPF64.set( arr, buff >> 3 );
      Module._cast_rays();
      Module._draw_sprites( buff, arr.length );
      Module._process_gui();
      Module._free( buff );

    })
  )
}

function printPlayers(){
  $.get('/log', function(data){
    console.log( data );
  })
}

function sendChat(){
  $.post('/chat', {
    user: playerName,
    msg: $("#f-send-msg").text()
  } ,function(data){
    $("#f-send-msg").empty();
    $("#f-main").scrollTop($("#f-main").prop("scrollHeight"));
  })
}

function playerLogoff(){

	$.ajax({
    type: 'post',
		async: false,
		data: {
      id: pid
		},
		url: '/signoff'
	});
}

$(

  window.addEventListener( "unload", function (e) {
		playerLogoff();
	}),

  $(document).on( "submit", "#sign-in", function(e){
    e.preventDefault();
    $.post('/signin', {
        user: $("#user").val(),
        pass: $("#pass").val(),
        old: playerName
      }, function( data ){
        $("#error").val('');
        if( !data ){
          $("#sign-in").prepend("<p id='error'>You fucked up somewhere</p>");
        }else
          playerName = data.user.user;

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
          old: playerName
        }, function( data ){

          $("#register").find('#error').remove();

          if( !data ){
            $("#register").prepend("<p id='error'>That name taken nigga</p>");

          }else{
            playerName = data.user.user;

          }
        })

      }else {
        $("#register").prepend("<p id='error'>Passwords do no match</p>");
      }

    $("#sign-user").val('');
    $("#sign-pass").val('');
    $("#sign-pass-conf").val('');
    Module._type_mode_off();
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
