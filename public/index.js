var playerName = "";

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
    const arr = new Float64Array( data.length * 5 );
    let buff;

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

    buff = Module._malloc( arr.length * arr.BYTES_PER_ELEMENT );
    Module.HEAPF64.set( arr, buff >> 3 );
    Module._cast_rays();
    Module._draw_sprites( buff, arr.length );
    Module._free( buff );
  })
}

function printPlayers(){
  $.get('/log', function(data){
    console.log( data );
    console.log( "ME CLIENT SIDE: " + playerName );
  })
}

//page initial loading
$(
  window.addEventListener('beforeunload', function (e) {

    e.preventDefault();
    $.post("/signoff", { name: playerName });
    e.returnValue = '';
  })
)
