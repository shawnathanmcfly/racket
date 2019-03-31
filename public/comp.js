var fNav = new Vue({
  el: "#f-nav",
  data:{
    show: true,
    styleDat: {
      backgroundColor: "black",
      float: "left",
      width: "100%",
      height: "60px",
      color: "white",
      borderRadius: "8px 8px 0px 0px",
      fontFamily: "'Anton', sans-serif",
      padding: "15px 5px 15px 5px",
      wordSpacing: "6px"

    }
  }
});

var sendMsg = new Vue({
  el: "#f-send-msg",
  data: {
    styleDat: {
      backgroundColor: "black",
      float: "left",
      width: "100%",
      height: "80px",
      color: "white",
      borderRadius: "0px 0px 8px 8px",
      fontFamily: "'Anton', sans-serif",
      padding: "15px 5px 15px 5px",
      marginTop: "10px"
    }
  }
});

var fMain = new Vue({
  el: "#f-main",
  data:{
    show: true,
    view: 'sendMsg',
    styleDat: {
      backgroundColor: "black",
      float: "left",
      width: "100%",
      height: "320px",
      color: "white",
      marginTop: "10px",
      padding: "10px",
      overflow: "auto"
    }
  }
});
