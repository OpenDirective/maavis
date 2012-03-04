localStorage.buttoncolour;
function setColour(colour){
	localStorage.setItem('buttoncolour',colour);
}
function getColour(){
	var colourbutton = localStorage.getItem('buttoncolour');
	alert('colour is set to '+colourbutton);
}