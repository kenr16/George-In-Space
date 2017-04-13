// $(document).ready(function(){
//   $("#click-here").click(function(event) {
//     event.preventDefault();
//     $(".end-screen").fadeIn(1000);
//     // ({'top': '0, 50%'}, 600);
//     $(".dropping-text").animate({top: '600px'}, 650);
//
//     setTimeout(function() {
//       location.reload();
//     }, 2000);
SplashScreen = {};
SplashScreen.preload = function() {
  this.game.load.image('splashscreen', 'images/splash1.png');
}

SplashScreen.create = function() {
  this.game.add.image(0, 0, 'splashscreen');
  setTimeout(function () {
      game.state.start('play', true, false, {level: 0});
    }, 5000);
}


var startNewGame = function () {
  if (!(game instanceof Phaser.Game)) {
    game = new Phaser.Game(960, 600, Phaser.AUTO, 'gamething');
    game.state.add('play', PlayState);
    game.state.add('splash', SplashScreen);
    //game.state.add('GameOver', gameOver);
    //game.state.start('play');
  }
    game.state.start('splash', true, false, {level: 0});

};

$(document).ready(function(){
  $('#click-here').click(startNewGame);
  $('#highscores').click(function() {
    //sort the scores
    $('#scoreResults').text('');
    highscores.sort(function(a,b) {
      return a.score - b.score;
      //generate <li>s and append them to some result <ul> tag
    }).forEach(function(score) {
      $('<li>').text(`${score.initials}   ${score.score}`).appendTo('#scoreResults');
    });
    //this should be a modal dialog
    $('.highscores').fadeIn(1000);
  });

  $(".highscores").click(function() {
    $('.highscores').fadeOut(1000);
  });


  $("#footer span").hover(function() {
    $("#footer").animate({bottom: '210px'}, 100);
    $("#footer span").addClass("move-span");

  });

  $("#footer").click(function() {
    $("#footer").animate({bottom: '0px'}, 100);
    $("#footer span").removeClass("move-span");
  });

});
