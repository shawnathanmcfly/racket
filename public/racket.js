Module.onRuntimeInitialized = _ => {

    Module.canvas = document.querySelector('canvas');
    $("canvas").hide();

    $("#game-window").append("<p class='logo'>Racket.</p>");
    $("#game-window").append("<p style='color:white;bottom:20px;left:20px;position:absolute;font-size:30px' class='start'>press SPACE to start</p>");
    $(".appear").animate({top: "100px"}, 3000, function(){
      this.remove();

    });



};
