var playerName = "";

function getPlayerStat( x, y, r ){
  return(
    $.post("/", { x: x, y: y, r: r }, function(data){
        playerName = data.name;

        console.log( playerName );

    })
  )
}

$(


  onunload = function(){

    $.post("/signoff", { name: playerName });

  }

)
