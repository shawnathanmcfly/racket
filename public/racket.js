Module.onRuntimeInitialized = _ => {

    Module.canvas = document.querySelector('canvas');
    $("canvas").hide();

    $("#game-window").append("<p class='logo'>Racket.</p>");
    $(".appear").animate({top: "100px"}, 7000, function(){
      this.remove();
      $("#game-window").append("<p id='pointer' style='position:absolute;bottom:10px;left:10px;font-size:45px;color:white'>press SPACE to start</p>");
    });



};
