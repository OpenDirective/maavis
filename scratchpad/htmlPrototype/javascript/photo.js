// functions to run the photo slideshow in MAAVIS
// Current hardcoded values will be modified in the future to fit with a data structure

// global vars for photo albums and slideshow
var imageIndex = 0;
var timeOutId;
var path;
var imageArray = new Array(new Array());
sessionStorage.setItem('slideshow', 'on');	//the slideshow initially is on autoplay
sessionStorage.album;

function setAlbum(album){
	sessionStorage.setItem('album',album);
}
function getAlbum(){
	var currentAlbum = sessionStorage.getItem('album');
	return currentAlbum;
}


// this runs the slideshow
function runSlideshow() {
   displayImg(imageIndex);	//display the first slide or wherever we are in the image index
   imageIndex ++;
   var arrayLimit = imageArray.length -1;
   if (imageIndex > arrayLimit) imageIndex = 0;
   status = imageIndex;
   sessionStorage.setItem('slideshow', 'on');
   timeOutId = setTimeout("runSlideshow();",3000);	
}

// this decides whether the slideshow is running or not and whether to toggle the 
// play / pause button and if the slidshow is run or paused.
function toggle(){
   if(document.getElementById("pauseplay").innerHTML == "<h2>Pause</h2>"){
   //if already playing then pause
   document.getElementById("pauseplay").innerHTML = "<h2>Play</h2>";
   clearTimeout(timeOutId);   
   //sessionStorage.setItem('slideshow', 'off');
   } else {   
   timeOutId=setTimeout("runSlideshow();",3000);
   document.getElementById("pauseplay").innerHTML = "<h2>Pause</h2>";
   }
}   
	
// this displays the image and is called by runSlideshow function
function displayImg(i) {
   if(parent.document.getElementById("photoFrame1")!=null)
   	{
   		parent.document.getElementById("photoFrame1").contentDocument.getElementById("photo").src = path + imageArray[i][0];
   		parent.document.getElementById("photoFrame1").contentDocument.getElementById("license").innerHTML = imageArray[i][4];
   		parent.document.getElementById("photoFrame1").contentDocument.getElementById("author").innerHTML = imageArray[i][1];
   		parent.document.getElementById("photoFrame1").contentDocument.getElementById("source").innerHTML = imageArray[i][2];
	parent.document.getElementById("photoFrame1").contentDocument.getElementById("title").innerHTML = imageArray[i][3];   		
   	}
}

function prevPhoto(){
	var slide = sessionStorage.getItem('slideshow');
	if(slide == "on") --imageIndex;
	// stop the slideshow
	clearTimeout(timeOutId); 
	document.getElementById("pauseplay").innerHTML = "<h2>Play</h2>";
	--imageIndex;
	if(imageIndex >= imageArray.length){
	    imageIndex = imageArray.length - 1;
	} else if (imageIndex < 0){	imageIndex = imageArray.length - 1;}
	displayImg(imageIndex);			
	sessionStorage.setItem('slideshow', 'off');
}

function nextPhoto(){
	// stop the slideshow and go forward a picture
 	clearTimeout(timeOutId); 
 	document.getElementById("pauseplay").innerHTML = "<h2>Play</h2>";
 	var slide = sessionStorage.getItem('slideshow');
 	if(slide == "on") --imageIndex;
 	imageIndex ++;
	//check the index is less than the array length
	if(imageIndex > imageArray.length-1 || imageIndex < 0){imageIndex = 0;}
	displayImg(imageIndex);	
	sessionStorage.setItem('slideshow', 'off');
}

function playOgg(){
	var clip = new Audio("../../MaavisMedia/Sounds/watchSlideshow.ogg");
    clip.play();
}
function playOgg2(){
	var clip = new Audio("../../MaavisMedia/Sounds/touchAlbum.ogg");
    clip.play();
}

function showPhotos(name){
	setAlbum(name);
	parent.frames[1].location.href = "photoButtons.html";
	parent.frames[0].location.href = "photoFrame.html";	
	parent.document.getElementById('header').innerHTML = "<h1 id=\"title\" onclick=\"playOgg()\" onkeypress=\"onEnter(event)\" tabindex=\"1\">Watch Slideshow</h1>";
}

//called when the slideshow buttons load
function initAlbum() {
	playOgg();
	var loadAlbum = getAlbum();
	if(loadAlbum=="galaxies") {
		path = "../../MaavisMedia/Photos/galaxies/";
		var firstphoto = new Array("800px-Spiral_galaxy_arms_diagram.png","Image by Dbenbenn", "http://en.wikipedia.org/wiki/File:Spiral_galaxy_arms_diagram.png","Spiral galaxy arms diagram","Creative Commons Attribution 3.0 Unported (CC BY 3.0)");
		var secondphoto = new Array("andromeda-galaxy.jpg","Photo by Adam Evans, 2010","http://www.shmoop.com/perseus-andromeda/photo-andromeda-galaxy.html","Andromeda, the Galaxy", "Creative Commons Attribution 3.0 Unported (CC BY 3.0)");
		imageArray[0] = firstphoto;
		imageArray[1] = secondphoto;
	} else if(loadAlbum=="neutronstars"){
		path = "../../MaavisMedia/Photos/neutronstars/";
		var firstphoto = new Array("star.png","Image: Corvin Zahn, Institute of Physics, Universität Hildesheim","Space Time Travel (http://www.spacetimetravel.org/)","Light deflection near a neutron star", "Creative Commons License Attribution-Share Alike 2.0 Germany (abbreviated 'cc-by-sa/2.0/de')");
		var secondphoto = new Array("neutronstar.png","Image: Corvin Zahn, Institute of Physics, Universität Hildesheim","Space Time Travel (http://www.spacetimetravel.org/)","Light deflection near a neutron star", "Creative Commons License Attribution-Share Alike 2.0 Germany (abbreviated 'cc-by-sa/2.0/de')");
		imageArray[0] = firstphoto;
		imageArray[1] = secondphoto;
	} else if (loadAlbum=="timetravel"){
		path = "../../MaavisMedia/Photos/timetravel/";
		//imageArray = new Array("wurmloch.png", "dice.png","blackhole.jpg","speedlight.png","wheels.png");
		var firstphoto = new Array("wurmloch.png","Image: Corvin Zahn, Institute of Physics, Universität Hildesheim", "Space Time Travel (http://www.spacetimetravel.org/)","Wormhole","Creative Commons License Attribution-Share Alike 2.0 Germany (abbreviated 'cc-by-sa/2.0/de')" );
		var secondphoto = new Array("dice.png","Image: Ute Kraus, Institute of Physics, Universität Hildesheim","Space Time Travel (http://www.spacetimetravel.org/)", "Cubes moving at 90% of the speed of light", "Creative Commons License Attribution-Share Alike 2.0 Germany (abbreviated 'cc-by-sa/2.0/de')");
		var thirdphoto = new Array("blackhole.jpg","Image: Ute Kraus, Institute of Physics, Universität Hildesheim", "Space Time Travel (http://www.spacetimetravel.org/)","Black Hole in front of the Milky Way", "Creative Commons License Attribution-Share Alike 2.0 Germany (abbreviated 'cc-by-sa/2.0/de')");
		var fourthphoto = new Array("speedlight.png","Image: Ute Kraus, Institute of Physics, Universität Hildesheim", "Space Time Travel (http://www.spacetimetravel.org/)","Moving at 90% of the speed of light", "Creative Commons License Attribution-Share Alike 2.0 Germany (abbreviated 'cc-by-sa/2.0/de')");		
		var fifthphoto = new Array("wheels.png","Image: Corvin Zahn, Institute of Physics, Universität Hildesheim", "Space Time Travel (http://www.spacetimetravel.org/)","Rolling Wheels", "Creative Commons License Attribution-Share Alike 2.0 Germany (abbreviated 'cc-by-sa/2.0/de')");		
		imageArray[0] = firstphoto;
		imageArray[1] = secondphoto;
		imageArray[2] = thirdphoto;
		imageArray[3] = fourthphoto;
		imageArray[4] = fifthphoto;
	}
	runSlideshow();
}

//plays audio clip when page loads TODO fix me!!
function init(){
	var urltoMatch = parent.frames[0].location.href;
	var patt1=/photoOptions.html/i;
	var patt2=/photoFrame.html/i;	
	if(patt1.test(urltoMatch)){ 
		audio = new Audio("../../MaavisMedia/Sounds/touchAlbum.ogg");
    	audio.play();
    	parent.document.getElementById("header").innerHTML = "<h1 id=\"title\" onclick=\"playOgg2()\" onkeypress=\"onEnter(event)\" tabindex=\"1\">Touch the album you want to look at</h1>";
    }
	if(patt2.test(urltoMatch)){ 
		playOgg();
		parent.document.getElementById('header').innerHTML = "<h1 id=\"title\" onclick=\"playOgg()\" onkeypress=\"onEnter(event)\" tabindex=\"1\">Watch Slideshow</h1>";
    	
    }
}

function reloadTitle(){
	parent.document.getElementById('header').innerHTML = "<h1 id=\"title\" onclick=\"playOgg()\" onkeypress=\"onEnter(event)\" tabindex=\"1\">Watch Slideshow</h1>";
}

function onEnter( evt ) {
	var keyCode = null;

	if( evt.which ) {
		keyCode = evt.which;
	} else if( evt.keyCode ) {
		keyCode = evt.keyCode;
	}
	if( 13 == keyCode ) {
		init();	
	}
}