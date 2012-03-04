sessionStorage.setItem('currentSong', '1');
sessionStorage.setItem('currentSongState', 'playing');
var audio1array = new Array();
var audio2array = new Array();
var multiaudioArray = new Array();

var filename = "Comet_Shoemaker-Levy_9.ogg";
var license = "This file is licensed under the Creative Commons Attribution-Share Alike 3.0 Unported license.";
var attribution = "	w:en:User:Macropode";
var licenselink ="http://creativecommons.org/licenses/by-sa/3.0/";
var name = "Comet Shoemaker Levy 9";
var source = "http://en.wikipedia.org/wiki/File:Comet_Shoemaker-Levy_9.ogg";
audio1array[0] = filename;
audio1array[1] = license;
audio1array[2] = attribution;
audio1array[3] = licenselink;
audio1array[4] = name;
audio1array[5] = source;
audio2array[0] = "En-BigBang.ogg";
audio2array[1] = license;
audio2array[2] = "Dmitry Brant";
audio2array[3] = licenselink;
audio2array[4] = "Big Bang";
audio2array[5] = "http://en.wikipedia.org/wiki/File:En-BigBang.ogg";
multiaudioArray[0] = audio1array;
multiaudioArray[1] = audio2array;


var pauselabel = "<h2>Pause</h2>";
var playlabel = "<h2>Play</h2>";

// called when the song buttons are clicked on and play the song clicked and 
// updates the music information area at the bottom of the page.
function loadMusic(src){	
	var song;
	var music;
	var getlastvolume = sessionStorage.getItem('currentSongVolume');
	var pausemusic;
	var currentsong = sessionStorage.getItem('currentSong');
//	if(currentsong!=null)currentsong.pause();
	if(src=="1"){
		music = document.getElementById("testmusic1");
		pauseMusic = document.getElementById("testmusic2");
		sessionStorage.setItem('currentSong', '1');
		if(getlastvolume!=null && undefined != getlastvolume )music.volume = getlastvolume; 
		if(music.currentTime){
		 if(music.currentTime!=null && music.currentTime!=undefined)music.currentTime=0; //set the song back to the beginning or the song will start of from where it were stopped last time
		}
	} else if(src=="2"){
		var music = document.getElementById("testmusic2");
		pauseMusic = document.getElementById("testmusic1");
		sessionStorage.setItem('currentSong', '2');
		if(getlastvolume!=null && undefined != getlastvolume)music.volume = getlastvolume;
		if(music.currentTime)music.currentTime=0; //set the song back to the beginning or the song will start of from where it were stopped last time
	}
	if(pauseMusic!=null){pauseMusic.pause();}	
	if(music!=null){
		music.play();
		setSongVol(music.volume);
		sessionStorage.setItem('currentSongVolume', music.volume);
		sessionStorage.setItem('currentSongState', 'playing');
		displaySongVol();
		if(parent.document.getElementById("contolFrame").contentDocument.getElementById("pauseplaytoggle")!=null)parent.document.getElementById("contolFrame").contentDocument.getElementById("pauseplaytoggle").innerHTML= pauselabel;
	}
}

function toggle(){
	var currentSong = sessionStorage.getItem('currentSong');
	var music1 = parent.document.getElementById("musicFrame1").contentDocument.getElementById("testmusic1");
	var music2 = parent.document.getElementById("musicFrame1").contentDocument.getElementById("testmusic2");

	if(parent.document.getElementById("contolFrame").contentDocument.getElementById("pauseplaytoggle").innerHTML== pauselabel){
		if(currentSong == "1") music1.pause();	 
		if(currentSong == "2") music2.pause();
		sessionStorage.setItem('currentSongState', 'paused');
		parent.document.getElementById("contolFrame").contentDocument.getElementById("pauseplaytoggle").innerHTML= playlabel;
	}
	else if(parent.document.getElementById("contolFrame").contentDocument.getElementById("pauseplaytoggle").innerHTML== playlabel){
		if(currentSong == "1") music1.play();	 
		if(currentSong == "2") music2.play();
		sessionStorage.setItem('currentSongState', 'playing');
		parent.document.getElementById("contolFrame").contentDocument.getElementById("pauseplaytoggle").innerHTML = pauselabel;
	}
	displaySongVol();
}

function quieterMusic(){
	var music = parent.document.getElementById("musicFrame1").contentDocument.getElementById("testmusic1");
	if (music.paused){
		var music = parent.document.getElementById("musicFrame1").contentDocument.getElementById("testmusic2");
	}
	if (music.volume > 1) {
	    music.volume = 1;
	} else if (music.volume < 0) {
	    music.volume = 0;
	} else if(music.volume >= 0.1){
	    music.volume = strip(music.volume - 0.1);
	}
	sessionStorage.setItem('currentSongVolume', music.volume);
	setSongVol(music.volume)
	displaySongVol();
}

function louderMusic(){
	var music = parent.document.getElementById("musicFrame1").contentDocument.getElementById("testmusic1");
	if (music.paused){
		var music = parent.document.getElementById("musicFrame1").contentDocument.getElementById("testmusic2");	
	}
	if (music.volume > 1) {
	    music.volume = 1;
	} else if (music.volume < 0) {
	    music.volume = 0;
	} else if (music.volume <= 0.9){
	    music.volume = strip(music.volume + 0.1);

	}
	sessionStorage.setItem('currentSongVolume', music.volume);	
	setSongVol(music.volume);
	displaySongVol();	
}

function playNext() {
	var music1 = parent.document.getElementById("musicFrame1").contentDocument.getElementById("testmusic1");
	var music2 = parent.document.getElementById("musicFrame1").contentDocument.getElementById("testmusic2");
	var currentsong = sessionStorage.getItem('currentSong');
	var getlastvolume = sessionStorage.getItem('currentSongVolume');
	var currentTime;
  	if (currentsong==2) { 	
		music2.pause();
		music1.currentTime=0;
		if(getlastvolume!=null && undefined != getlastvolume )music1.volume = getlastvolume; 
		music1.play();
		sessionStorage.setItem('currentSongState', 'playing');
		sessionStorage.setItem('currentSong', '1');
		setSongVol(music1.volume);
	} else if (currentsong==1) { 	
		music1.pause();	
		if(music2.currentTime !=null && undefined != music2.currentTime)music2.currentTime=0;
		if(getlastvolume!=null && undefined != getlastvolume )music2.volume = getlastvolume; 
		music2.play();	
		sessionStorage.setItem('currentSongState', 'playing');
		sessionStorage.setItem('currentSong', '2');
		setSongVol(music2.volume);
	}
	parent.document.getElementById("contolFrame").contentDocument.getElementById("pauseplaytoggle").innerHTML= pauselabel; //set the toggle button to pause
	displaySongVol();
}

function changeMusic() {
	parent.document.getElementById("musicFrame1").contentWindow.location.href = "musicOptions.html";
	title = "Choose the audio you want to hear";	 
	parent.document.getElementById("header").innerHTML = "<h1 onkeypress=\"onEnter(event, 'choose')\" tabindex=\"1\" id=\"header\" onclick=\"init()\" onload=\"init()\">"+ title+"</h1>";
	parent.document.getElementById("contolFrame").contentWindow.location.href = "../OtherControlButton.html";

}

function strip(number) {
	return (parseFloat(number.toPrecision(2)));
}

function init(){
	title = "Choose the audio you want to hear";
	document.getElementById("header").innerHTML = "<h1 onkeypress=\"onEnter(event, 'choose')\" tabindex=\"1\" id=\"header\" onclick=\"init()\" onload=\"init()\">"+ title+"</h1>";
    audio = new Audio("../../MaavisMedia/Sounds/chooseAudio.ogg");
    audio.play();
   }
   
function listenMusic(){
	audio = new Audio("../../MaavisMedia/Sounds/listenAudio.ogg");
    audio.play();
}
   
   
function loadVarious(){
	title = "Listen to audio";
	parent.document.getElementById("header").innerHTML = "<h1 tabindex=\"1\" onkeypress=\"onEnter(event, 'listen')\" id=\"header\" onclick=\"listenMusic()\" onload=\"listenMusic()\">"+ title+"</h1>";
    audio = new Audio("../../MaavisMedia/Sounds/listenAudio.ogg");
    audio.play();
	buttons = "<button type='submit' onclick='loadMusic(\"1\")' style='height: 100px; width: 600px'><h2>"+ audio1array[4] +"</h2></button><button type='submit' onclick='loadMusic(\"2\")' style='height: 100px; width: 600px'><h2>"+ audio2array[4] +"</h2></button>";
	document.getElementById("intro").innerHTML = buttons;
	parent.document.getElementById("contolFrame").contentWindow.location.href = "musicButtons.html";
	loadMusic('1'); //autoplay the first track to mimic the behaviour of MAAVIS 
}

// if the enter key is pressed (code 13) then a function is called depending on the variable ogg these functions play audio titles 
function onEnter( evt, ogg) {
	var keyCode = null;

	if( evt.which ) {
		keyCode = evt.which;
	} else if( evt.keyCode ) {
		keyCode = evt.keyCode;
	}
	if( 13 == keyCode ) {
		if(ogg=='choose')init();
		else if(ogg=='listen')listenMusic();
	}
}

// this displays the song no. and its name that is playing, its volume and whether it is paused or playing 
function displaySongVol(){
		var currentSong = sessionStorage.getItem('currentSong');
		if(currentSong=="1")
		{
			var songname=audio1array[4];
			var source = multiaudioArray[0][5];
		}
		else 
		{	
			var songname=audio2array[4];
			var source = multiaudioArray[1][5];
		}
		
		var currentSongVol = sessionStorage.getItem('currentSongVolume');
		var currentSongState = sessionStorage.getItem('currentSongState');
		parent.document.getElementById("musicFrame1").contentDocument.getElementById("songinfo").innerHTML = "Current audio playing is track number:" + currentSong +" "+ songname + "<br>Volume: "+currentSongVol+".<br>The current track state: "+currentSongState+".<br>Source: <a href='"+source+"' target='_blank'>"+ source+"</a><br>" + multiaudioArray[0][1];
}

//sets the volume of a song to sessionStorage variable
function setSongVol(vol){
		sessionStorage.setItem('currentSongVolume', vol);
}