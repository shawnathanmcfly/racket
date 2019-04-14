/*
    Sorry, no JSX. Too much overhead for use with vue cdn
*/

var chatWindow = Vue.component( 'chat-window', {
  template:
    "<div>" +
    "<label style='font-size:18px' for='f-main'>Chat</label>" +
      "<div id='f-main' class='mt-1' style='padding:5px;font-size:16px;line-height:18px;overflow:auto;background-color:#232323; height:280px'>" +
      "</div>" +
      "<label style='font-size:18px' for='f-send-msg'>Send Message</label>" +
      "<textarea id='f-send-msg' class='mt-1' style='font-size:16px;line-height:18px;color:white;border:none;height:80px; background-color:#232323; width:100%'></textarea>" +
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

var controls = Vue.component( 'controls', {
  template:

      "<div style='background-color:#232323; padding:15px 15px 15px 15px; position:absolute; bottom:20px; width:80%'>" +
        "<span><img src='https://img.webnots.com/2014/03/C1.png' width='40' height='40'> = message mode</span><br>" +
        "<span>" +
          "<img src='https://img.webnots.com/2014/03/W1.png' width='40' height='40'>" +
          "<img src='https://img.webnots.com/2014/03/S1.png' width='40' height='40'>" +
          "<img src='https://img.webnots.com/2014/03/A1.png' width='40' height='40'>" +
          "<img src='https://img.webnots.com/2014/03/D1.png' width='40' height='40'>" +
          " = move" +
        "</span><br>" +
        "<span><img src='https://img.webnots.com/2014/03/Pipe-and-Left-Slash.png' width='40' height='40'> = sound on</span><br>" +
        "<span><img src='https://img.webnots.com/2014/03/M1.png' width='40' height='40'> = capture / release mouse </span><br>" +
        "<span>MOUSE BUTTONS = shoot</span><br>" +
      "</div>"

});

var aboutWindow = Vue.component( 'about-window', {
  template:
    "<p><b>Racket</b> is an experimental online game using C, Web Assembly, " +
     "Javascript and Emscripten. The goal is to demonstrate the fact " +
     "the web browser is a reliable, cross platform option for realtime and resource hungry applications." +
     "</p>"
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
      height: "auto",
      color: "white",
      padding: "20px 20px 20px 20px",
      fontFamily: "'Anton', sans-serif",
      borderRadius: "8px 8px 8px 8px",
      minHeight: "480px"
    }
  },
  components: {
    controls: controls
  }
});

var fNav = new Vue({
  el: "#f-nav",
  data:{
    currentTab: "chat-window",
    styleDat: {
      backgroundColor: "black",
      width: "100%",
      height: "auto",
      color: "white",
      borderRadius: "8px 8px 8px 8px",
      fontFamily: "'Anton', sans-serif",
      padding: "15px 15px 15px 15px",
      wordSpacing: "6px",
      lineHeight: "35px",
      minHeight: "480px"
    }
  },
  components: {
    chatWindow: chatWindow,
    loginWindow: loginWindow,
    registerWindow: registerWindow,
    aboutWindow:aboutWindow
  }
});
