$(document).ready(function(){
  $("#click-here").click(function(event) {
    event.preventDefault();
    $(".end-screen").fadeIn(1000);
    // ({'top': '0, 50%'}, 600);
    $(".dropping-text").animate({top: '600px'}, 650);

    setTimeout(function() {
      location.reload();
    }, 2000);

  });
  $(".end-screen").click(function(event) {
    $(".end-screen").fadeOut(1000);
    $(".dropping-text").animate({top: '-600px'}, 650);
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
