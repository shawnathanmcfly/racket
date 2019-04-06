/*
    Sorry, no JSX. Too much overhead for use with vue cdn
*/

var chatWindow = Vue.component( 'chat-window', {
  template:
    "<div>" +
      "<div id='f-main' class='mt-1' style='overflow:auto;background-color:#232323; height:300px'>" +
      "</div>" +
      "<textarea id='f-send-msg' class='mt-1' style='border:none;height:80px; background-color:#232323; width:100%'></textarea>" +
    "</div>"
});

var loginWindow = Vue.component( 'login-window', {
  template:
    "<form id='sign-in'>" +
      "<div class='form-group'>" +
        "<label for='user'>Username:</label>" +
        "<input type='input' class='form-control' id='user'>" +
      "</div>" +
      "<div class='form-group'>" +
        "<label for='pass'>Password:</label>" +
        "<input type='password' class='form-control' id='pass'>" +
      "</div>" +
      "<button type='submit' class='btn btn-primary'>Submit</button>" +
    "</form>"
});

var registerWindow = Vue.component( 'register-window', {
  template:
    "<form id='register'>" +
      "<div class='form-group'>" +
        "<label for='sign-user'>Username:</label>" +
        "<input type='input' class='form-control' id='sign-user'>" +
      "</div>" +
      "<div class='form-group'>" +
        "<label for='sign-pass'>Password:</label>" +
        "<input type='password' class='form-control' id='sign-pass'>" +
      "</div>" +
      "<div class='form-group'>" +
        "<label for='sign-pass-conf'>Confirm Password:</label>" +
        "<input type='password' class='form-control' id='sign-pass-conf'>" +
      "</div>" +
      "<button type='submit' class='btn btn-primary'>Submit</button>" +
    "</form>"
});

var fGui = new Vue({
  el: "#f-gui",
  data:{
    show: true,
    view: 'f-gui',
    styleDat: {
      backgroundColor: "black",
      float: "left",
      width: "100%",
      height: "480px",
      color: "white",
      padding: "5px",
      fontFamily: "'Anton', sans-serif",
      borderRadius: "8px 8px 8px 8px",
      textAlign: "center"
    }
  }
});

var fNav = new Vue({
  el: "#f-nav",
  data:{
    currentTab: "chat-window",
    styleDat: {
      backgroundColor: "black",
      width: "100%",
      height: "480px",
      color: "white",
      borderRadius: "8px 8px 8px 8px",
      fontFamily: "'Anton', sans-serif",
      padding: "15px 5px 15px 5px",
      wordSpacing: "6px"
    }
  },
  components: {
    chatWindow: chatWindow,
    loginWindow: loginWindow,
    registerWindow: registerWindow
  }
});
