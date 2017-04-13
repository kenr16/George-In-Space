var startNewGame = function () {
  if (!(game instanceof Phaser.Game)) {
    game = new Phaser.Game(960, 600, Phaser.AUTO, 'gamething');
    game.state.add('play', PlayState);
    //game.state.add('GameOver', gameOver);
    //game.state.start('play');
  }
    game.state.start('play', true, false, {level: 4});
};

$(document).ready(function(){
  $('#click-here').click(startNewGame);
  $('#highscores').click(function() {
    //sort the scores
    highscores.sort(function(a,b) {
      return a.score - b.score;
      //generate <li>s and append them to some result <ul> tag
    }).forEach(function(score) {
      $('<li>').text(`${score.initials}   ${score.score}`).appendTo('#scoreResults');
    });
    //this should be a modal dialog
    $('#scoreResults').fadeIn(1000);
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
