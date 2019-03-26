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

    const arr = new Float64Array( data.length * 4 );
    let buff;

    for( let i in data ){
      arr[i*4] = data[i].x;
      arr[i*4+1] = data[i].y;
      arr[i*4+2] = data[i].r;
      arr[i*4+3] = data[i].st;
    }

    buff = Module._malloc( arr.length * arr.BYTES_PER_ELEMENT );
    Module.HEAPF64.set( arr, buff >> 3 );
    Module._cast_rays();
    Module._draw_sprites( buff, arr.length );
    Module._free( buff );
  })
}

//page initial loading
$(
  onunload = function(){

    $.post("/signoff", { name: playerName });


  },

  onload = function(){

  }
)
