var ${widget.shortname}_player_controller = {
    // toggle to indicate if the video is currently playing
    playing: true,
}

$('#home').live('pageshow',function(event) {
    $('.togglePlaying').click(function(event) {
	if ( ${widget.shortname}_player_controller.playing) {
	    ${widget.shortname}_player_controller.playing = false;
	    alert("Stop playing");
	} else {
	    ${widget.shortname}_player_controller.playing = true;
	    alert("Start playing");
	}
    });
    $('#reduceVolume').click(function(event) {
	alert("Quieter");
    });
    $('#increaseVolume').click(function(event) {
	alert("Louder");
    });
    $('#back').click(function(event) {
	alert("Back");
    });

});
