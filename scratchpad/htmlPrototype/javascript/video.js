var videosrc = '<source id="mp4_src" src="../../MaavisMedia/Videos/Spiral_arms.ogv" type=\'video/ogg; codecs="theora, vorbis"\' />';
var videodescription = 'Spiral arms of a galaxy formed by simplified model of density waves. In this example the arms remain fixed despite the rotation of the galaxy. Stars are Moving in and out of the Spiral arms.';
var vidoeattrib = '<a id="attribution" href="http://commons.wikimedia.org/wiki/File:Spiral_arms.ogv">Author: Ingo Berg</a>';
var videolicense = '<a id="license" href="http://creativecommons.org/licenses/by-sa/3.0/deed.en">This file is licensed under the Creative Commons Attribution-Share Alike 3.0 Unported license.</a>';
var videoArray = new Array();
videoArray[0] = videosrc;
videoArray[1] = videodescription;
videoArray[2] = vidoeattrib;
videoArray[3] = videolicense;

//Video Functions for MAAVIS
function loadVideo(){
	parent.document.getElementById("videoFrame1").contentWindow.location.href='videoPlayer.html';
	parent.document.getElementById("contolFrame").contentWindow.location.href='videoButtons.html';
}

function playvideo(){
	var video = parent.document.getElementById("videoFrame1").contentDocument.getElementById("testvideo");
	if (video.paused||video.ended) video.play();
	video.onended = function(e) {
		if(!e) { e = window.event; }
		parent.document.getElementById("contolFrame").contentDocument.getElementById("pauseplaytoggle").innerHTML = "<h2>Play</h2>";
	}
	parent.document.getElementById("videoFrame1").contentDocument.getElementById("description").innerHTML = videoArray[1];
	parent.document.getElementById("videoFrame1").contentDocument.getElementById("license").innerHTML = videoArray[3];
	parent.document.getElementById("videoFrame1").contentDocument.getElementById("attribution").innerHTML = videoArray[2];
	parent.document.getElementById("header").innerHTML = "<h1 tabindex=\"1\" onkeypress=\"onEnter(event,'w')\" onclick=\"playvideo()\">Watch Video</h1>";
	audio = new Audio("../../MaavisMedia/Sounds/watchVideo.ogg");
    audio.play();
}


function pauseVideo(){
	var video = parent.document.getElementById("videoFrame1").contentDocument.getElementById("testvideo");
	
	function playVideo(){
	  video.play();
	  video.onended = function(e) {
	  	if(!e) { e = window.event; }
	  		parent.document.getElementById("contolFrame").contentDocument.getElementById("pauseplaytoggle").innerHTML = "<h2>Play</h2>";
		}
	}
	 
	function pauseVideo(){
	  video.pause();	 
	}
	
	  if (video.paused || video.ended) {
	    playVideo();
	    document.getElementById('pauseplaytoggle').innerHTML = "<h2>Pause</h2>";
	  } else {
	    pauseVideo();
	    document.getElementById("pauseplaytoggle").innerHTML = "<h2>Play</h2>";
	  }	
}

function louder(){
	var video = parent.document.getElementById("videoFrame1").contentDocument.getElementById("testvideo");
	 if (video.volume > 1) {
	    video.volume = 1;
	  } else if (video.volume < 0) {
	    video.volume = 0;
	  } else {
	    video.volume = strip(video.volume + 0.1);
	  }
}

function quieter(){
	var video = parent.document.getElementById("videoFrame1").contentDocument.getElementById("testvideo");
	 if (video.volume > 1) {
	    video.volume = 1;
	  } else if (video.volume < 0) {
	    video.volume = 0;
	  } else {
	    video.volume = strip(video.volume - 0.1);
	  }	
}

function strip(number) {
	return (parseFloat(number.toPrecision(2)));
}

// sound file to play when first page loads
function init(){
    document.getElementById("header").innerHTML = "<h1 tabindex=\"1\" onkeypress=\"onEnter(event,'t')\" onclick=\"init()\">Touch the video you want to look at</h1>";
    audio = new Audio("../../MaavisMedia/Sounds/touchLook.ogg");
    audio.play();    
}

// sound file to play when first page loads
function parentinit(){
    parent.document.getElementById("header").innerHTML = "<h1 tabindex=\"1\" onkeypress=\"onEnter(event,'t')\" onclick=\"init()\">Touch the video you want to look at</h1>";
    audio = new Audio("../../MaavisMedia/Sounds/touchLook.ogg");
    audio.play();    
}

function onEnter( evt,ogg ) {
	var keyCode = null;

	if( evt.which ) {
		keyCode = evt.which;
	} else if( evt.keyCode ) {
		keyCode = evt.keyCode;
	}
	if( 13 == keyCode ) {
	if(ogg=='t')init();	
	else if (ogg=='w')playvideo();
	}
}

