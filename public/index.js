
$(

  $.post("/", {

    name: "Noobius",
    x: "300",
    y: "300",
    dir: "0.43"

    } ,function(data){
      console.log(data);
  })
)
