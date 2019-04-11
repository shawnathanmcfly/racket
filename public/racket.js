Module.onRuntimeInitialized = _ => {

    Module.canvas = document.querySelector('canvas');
    $("canvas").hide();

    $("#game-window").append("<p class='logo'>Racket.</p>");
    $(".appear").animate({top: "100px"}, 3000, function(){
      this.remove();

    });



};
