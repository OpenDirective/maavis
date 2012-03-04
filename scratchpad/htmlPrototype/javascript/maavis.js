function init(){
	var audio = document.getElementById('testmusic');
	audio.play();
}	
function onEnter( evt ) {
	var keyCode = null;	
	if( evt.which ) {
		keyCode = evt.which;
	} else if( evt.keyCode ) {
		keyCode = evt.keyCode;
	}
	if( 13 == keyCode ) init();
}
function changeToClass(name) {
	var elements = document.getElementsByTagName('button');
	var i = 0;
	for(i=0;i<elements.length;i++){
		elements[i].className = name+"bground";
	}
}
function checkButtonColour(){
	var name = localStorage.getItem('buttoncolour');
	document.getElementById("title").innerHTML="Touch the activity you want to do";
	document.getElementById("buttonfieldset").innerHTML='<div><button type="submit" tabindex="2" onclick="location.href=\'Photos/photosMenu.html\'"><iframe src="photosWidget.html" width="300" height="220" frameBorder="0" scrolling="no" seamless></iframe></button><button type="submit" tabindex="3" onclick="location.href=\'Videos/videosMenu.html\'"><iframe src="videosWidget.html" width="300" height="220" frameBorder="0" scrolling="no" seamless></iframe></button><button type="submit" tabindex="4" onclick="location.href=\'Information/informationMenu.html\'"><iframe src="informationWidget.html" width="300" height="220" frameBorder="0" scrolling="no" seamless></iframe></button></div><div><button type="submit" tabindex="5" onclick="location.href=\'Music/musicMenu.html\'"><iframe src="musicWidget.html" width="300" height="220" frameBorder="0" scrolling="no" seamless></iframe></button><button type="submit" tabindex="6" onclick="location.href=\'Programs/programsMenu.html\'"><iframe src="programsWidget.html" width="300" height="220" frameBorder="0" scrolling="no" seamless></iframe></button><button type="submit" tabindex="7" onclick="location.href=\'introMore.html\'"><iframe src="moreItems.html" width="300" height="220" frameBorder="0" scrolling="no" seamless></iframe></button></div>';
	if(name!=null)changeToClass(name);
}
function checkButtonColour2(){	
	var name = localStorage.getItem('buttoncolour');
	document.getElementById("title").innerHTML="Touch the activity you want to do";
	document.getElementById("buttonfieldset").innerHTML = '<div><button type="submit" tabindex="2" onclick="location.href=\'Speech/speechMenu.html\'"><iframe src="speechWidget.html" width="300" height="220" scrolling="no" seamless></iframe></button></div><div><button type="submit" tabindex="3" onclick="location.href=\'index.html\'"><iframe src="moreItems.html" width="300" height="220" seamless></iframe></button></div>';
	if(name!=null)changeToClass(name);
}