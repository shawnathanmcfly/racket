
module.exports = {

  players: {},

  newbNames: [
      "Newbard Dreyfuss",
      "Im Carrying The Team",
      "Duke Cuckem",
      "A Zima Pleze",
      "SafeZone1990",

      //Reserved for Travis Achimasi
      "ChinUpper",
      "Nose Pointer",
      "Chuckles",
      "AppleUser1990",
      "DryBagelMucher",

  ],

  randomNewbName: function(){

    return this.newbNames[ Math.floor((Math.random() * this.newbNames.length ))];
  }
}
