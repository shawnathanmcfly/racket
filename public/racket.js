Module.onRuntimeInitialized = _ => {

    Module.canvas = document.querySelector('canvas');
    $("canvas").hide();

    $("#game-window").append("<p class='logo'>Racket.</p>");
    $("#game-window").append("<p style='color:white;bottom:20px;left:20px;position:absolute;font-size:30px' class='start'>press SPACE to start</p>");
    $(".appear").animate({top: "100px"}, 3000, function(){
      this.remove();
    });
    $("#f-gui").prepend("<p align='center'>FRAGS</p><p align='center' style='font-size:40px;' id='frags'>" + 0 + "</p>");
    $("#f-gui").prepend("<p align='center'>HEALTH</p><p align='center' style='font-size:40px;' id='health'>" + 100 + "</p>");
    $("#f-main").scrollTop($("#f-main").prop("scrollHeight"));



};
