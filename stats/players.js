
module.exports = {

  players: {},

  newbNames: [
      "Newbard Dreyfuss",
      "Sir Spanks Alot",
      "Im Carrying The Team",
      "Duke Cuckem",
      "A Zima Pleze",
      "SafeZone1990",

      //Reserved for Travis Achimasi
      "ChinUpper",
      "Nose Pointer",

  ],

  randomNewbName: function(){

    return this.newbNames[ Math.floor((Math.random() * this.newbNames.length ))];
  }
}
