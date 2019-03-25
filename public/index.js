var playerName = "";

//getPlayerStat is called from C to control frame rate
function getPlayerStat( x, y, r ){
  return(
    $.post("/", { x: x, y: y, r: r }, function(data){
        playerName = data.name;
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

    const arr = new Float64Array( (data.length - 1) * 3 );
    var buff;

    for( let i in data ){
      if( data[i].name === playerName )
        continue;
      arr[i*3] = data[i].x;
      arr[i*3+1] = data[i].y;
      arr[i*3+2] = data[i].r;
    }

    buff = Module._malloc( (arr.length - 1) * arr.BYTES_PER_ELEMENT );
    Module.HEAPF64.set( arr, buff >> 3 );
    Module._cast_rays();
    Module._draw_objects( buff, (arr.length - 1) );
    Module._free( buff );
  })
}

//page initial loading
$(
  onunload = function(){

    $.post("/signoff", { name: playerName });


  }
)
