var playerName = "", gameFlags = 0;

/*
    Game Flags - Binary Packed Data for less
                 data transfering. Below are
                 the codes in hex.

    0x01 = New global chat message
*/


//getPlayerStat is called from C to control frame rate
function getPlayerStat( x, y, r ){
  return(
    //////////////////////////////////
    //NOTE: ST is dummy for testing!!!!!
    /////////////////////////////////---|
    $.post("/", { x: x, y: y, r: r, st: 0 }, function(data){
        playerName = data.name;
        $("title").html(playerName);
    })
  )
}

function sendPlayerData( x, y, r ){
  return(
    $.post("/data", {x:x, y:y, r:r, name:playerName }, function(data){

    })
  )
}

function getPlayerData(){
  $.get("/data", function(data){

    //set typed array to pass to C function
    const arr = new Float64Array( (data.length - 1) * 5 );
    let buff;

    //splice yourself from list, no need to render your own sprite
    for( let i in data ){
      if( data[i].name === playerName ){
        gameFlags = data[i].gf;
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

      arr[i*5] = mappedPlayers[i].x;
      arr[i*5+1] = mappedPlayers[i].y;
      arr[i*5+2] = mappedPlayers[i].r;
      arr[i*5+3] = mappedPlayers[i].d;
      arr[i*5+4] = mappedPlayers[i].st;
    }

    //allocate space in virtual heap for pointer algorithm in C
    buff = Module._malloc( arr.length * arr.BYTES_PER_ELEMENT );
    Module.HEAPF64.set( arr, buff >> 3 );
    processFlags();
    Module._cast_rays();
    Module._draw_sprites( buff, arr.length );
    Module._process_gui();
    Module._free( buff );

  })
}

function printPlayers(){
  $.get('/log', function(data){
    console.log( data );
    console.log( "ME CLIENT SIDE: " + playerName );
  })
}

function getChat(){
  $.get('/chat', function(data){
    $("#f-main").empty();
      for( let i in data ){
        $('#f-main').append( "<p>" + data[i].user + ": " + data[i].msg + "</p>")
      }
  });
}

function getNewChat(){
  $.ajax( {
    type: 'get',
		async: false,
		url: '/newchat',
    success: function(data){
      $('#f-main').append( "<p>" + data.user + ": " + data.msg + "</p>")
    }
	});
}

function resetFlag( flag ){
  $.post('/resetflag', { user: playerName, flag: flag }, function(data){

  })
}

function processFlags(){
    //Bit one set, new global chat message to render
    if( gameFlags & 1 ){
      getNewChat();
      resetFlag( gameFlags & 0xFFFFFFFE );
    }
}

function sendChat(){
  $.post('/chat', {
    user: playerName,
    msg: $("#f-send-msg").text()
  } ,function(data){
    $('#f-main').append( "<p>" + playerName + ": " + $("#f-send-msg").text() + "</p>")
    $("#f-send-msg").empty();

  })
}

function playerLogoff(){

	$.ajax( {
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
