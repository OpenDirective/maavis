// functions to run the Information section in MAAVIS
// Current hardcoded values will be modified in the future to fit with a data structure


function scrollUp(){
			parent.document.getElementById("infoFrame1").contentWindow.scrollBy(0,-50);
}

function scrollDown(){
			parent.document.getElementById("infoFrame1").contentWindow.scrollBy(0,100);
}

function scrollLeft(){
			parent.document.getElementById("infoFrame1").contentWindow.scrollBy(-50,50);
}

function scrollRight(){
			parent.document.getElementById("infoFrame1").contentWindow.scrollBy(80,0);
}

function bigger(){
			parent.document.getElementById("infoFrame1").style.zoom="300%";
}

function smaller(){
}

function prevPage(){
			parent.document.getElementById("infoFrame1").contentWindow.history.back();
			parent.frames[1].location.href = 'infoButtons.html';
}


// audio played when page loads
function init(){
	audio = new Audio("../../MaavisMedia/Sounds/touchRead.ogg");
	audio.play();
	parent.document.getElementById("header").innerHTML = "<h1 id=\"header\" onclick=\"init()\" tabindex=\"1\" onkeypress=\"onEnter(event,'touch')\">Touch the topic you want to read</h1>";	
}

function loadInfo(url){
 	parent.frames[0].location.href = url;
 	parent.frames[1].location.href = 'infoButtons.html';
 	parent.document.getElementById("contolFrame").height="600";
	parent.document.getElementById("contolFrame").width="300";
	parent.document.getElementById("header").innerHTML = "<h1 id=\"header\" onclick=\"init2()\" tabindex=\"1\" onkeypress=\"onEnter(event,'look')\">Look at or read things</h1>";	
}

//audio file played when the selected information has loaded e.g. the guardian website or NHS direct web site
function init2(){
	audio = new Audio("../../MaavisMedia/Sounds/lookRead.ogg");
	audio.play();
	parent.document.getElementById("header").innerHTML = "<h1 id=\"header\" onclick=\"init2()\" tabindex=\"1\" onkeypress=\"onEnter(event,'look')\">Look at or read things</h1>";	

}

function onEnter( evt, ogg ) {
	var keyCode = null;

	if( evt.which ) {
		keyCode = evt.which;
	} else if( evt.keyCode ) {
		keyCode = evt.keyCode;
	}
	if( 13 == keyCode ) {
	if(ogg == 'touch')init();	
	else if(ogg == 'look') init2();
	}
}