var ${widget.shortname}_app_controller = {
    /**
     * The widget property maavis.widgets contains a comma separated list
     * of widgets that need to be provided on the home page. This method converts
     * that list into the appropriate home page elements.
     */ 
    createRunPanels: function() {
	var output = "widgets:";
	var widgets = "${maavis.widgets}".split(",");
	for (var idx = 0; idx < widgets.length; idx++) {
	    var widget = widgets[idx];
	    output = output + " " + widget;
	}
	// FIXME: need to do something with this output (i.e. get it on the page)
        // FIXME: need to make this ouput the actual runPanels
    },
    
}

$('#home').live('pageshow',function(event) {
    $('#video').click(function(event) {
	alert("Selected Video");
	${widget.shortname}_app_controller.createRunPanels();
    });
    $('#news').click(function(event) {
	alert("Selected News");
    });
    $('#audio').click(function(event) {
	alert("Selected Audio");
    });
    $('#chat').click(function(event) {
	alert("Selected Chat");
    });
    $('#photo').click(function(event) {
	alert("Selected Photo");
    });
    $('#other').click(function(event) {
	alert("Selected Other");
    });

});
