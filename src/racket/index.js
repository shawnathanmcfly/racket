var playerName = "", pid = 0, health = 100;

//getPlayerStat is called from C to control frame rate
function getPlayerStat( x, y, r ){
  return(
    //////////////////////////////////
    //NOTE: ST is dummy for testing!!!!!
    /////////////////////////////////---|
    $.post("/", { x: x, y: y, r: r, st: 0 }, function(data){
        playerName = data.name;
        pid = data.id;
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
    $.post("/data", {x:x, y:y, r:r, name:playerName }, function(data){
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
    $.get("/data/" + pid, function(stuff){
      let data = stuff.pd;
      health -= stuff.dam;

      $("#health").text( ""+health );

      //set typed array to pass to C function
      const arr = new Float64Array( (data.length - 1) * 6 );
      let buff;

      //splice yourself from list, no need to render your own sprite
      for( let i in data ){
        if( data[i].name === playerName ){
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
      name: playerName
		},
		url: '/signoff'
	});
}

$(

  window.addEventListener( "unload", function (e) {

		playerLogoff();
	})

)
