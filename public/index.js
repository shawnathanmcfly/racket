var playerName = "";

//getPlayerStat is called from C to control frame rate
function getPlayerStat( x, y, r ){
  return(
    $.post("/", { x: x, y: y, r: r }, function(data){
        playerName = data.name;

        console.log( playerName );
    })
  )
}

//page initial loading
$(
  onunload = function(){

    $.post("/signoff", { name: playerName });

  }
)
