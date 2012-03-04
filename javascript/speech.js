// functions for Speech widget

// function selection() javascript
// selects the topic you would like to talk about
function selection(){
	parent.document.getElementById("header").innerHTML = "<h1 tabindex=\"1\" onkeypress=\"onEnter(event,'word')\" onclick=\"init('word')\">Touch the words you want to speak</h1>";
	document.getElementById("buttondiv").innerHTML = "<button id='speech2' type='submit' style='height: 220px; width: 300px' onclick='init(\"acceleration\")'><span><h2>acceleration</h2></span></button><button  type='submit' style='height: 220px; width: 300px' onclick='init(\"acoustics\")'><span><h2>acoustics</h2></span></button>";
	parent.frames[1].location.href = '../OtherControlButton.html';
	init('word');
}

// plays ogg files for the selected topics
function init(audioclip){
	if (audioclip=="acceleration") audioOgg= "../../MaavisMedia/Sounds/acceleration.ogg";
	else if (audioclip == "acoustics") audioOgg = "../../MaavisMedia/Sounds/acoustics.ogg";
	else if(audioclip == "topic") audioOgg = "../../MaavisMedia/Sounds/topicSpeak.ogg";
	else if(audioclip == "word") audioOgg = "../../MaavisMedia/Sounds/touchSpeak.ogg";
	audio = new Audio(audioOgg);			
	audio.play();
}

function onEnter(evt, ogg) {
	var keyCode = null;

	if( evt.which ) {
		keyCode = evt.which;
	} else if( evt.keyCode ) {
		keyCode = evt.keyCode;
	}
	if( 13 == keyCode ) {
		init(ogg);	
	}
}