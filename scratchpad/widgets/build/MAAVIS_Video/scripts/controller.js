
/*
*  Javascript from template: twoColumn
*/ 
/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var MAAVIS_Video_twoColumn_controller = {
    init:function() {
      MAAVIS_Video_twoColumn_controller.update();
    },

    /**
     * Update the display
     */
    update:function() {
	// expand the search box on screens that are either wide enough (alongside results) or tall enough
	if ($.mobile.media("only screen and (min-width : 801px)")) {
	    $('#content-secondary .ui-collapsible').each(
		function() {
		    $(this).trigger('expand');
		});
	} else if ($.mobile.media("only screen and (min-width : 641px) and (max-width : 1024px)") || $.mobile.media("only screen and (min-width : 1801px)")) {
	    $('#content-secondary .ui-collapsible').each(
		function() {
		    $(this).trigger('expand');
		});
	} else {
	    $('#content-secondary .ui-collapsible').each(
		function() {
		    $(this).trigger('collapse');
		});
	}
    },

}

$('#home').live('pageinit',function(event) {
   MAAVIS_Video_twoColumn_controller.init();
})

/*
*  Javascript from template: base
*/ 
/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The @widget.shortname@_controller object
 * This is used to wire up the view and model with actions
 */ 
var MAAVIS_Video_controller = {
    /**
     * A dictionary of callback functions that are called whenever an
     * event is fired by this widget.
     */
    callbacks: {},

    init:function() {
        MAAVIS_Video_controller.update();
    },

    /**
     * Update the display
     */
    update:function() { 
    },

   /**
    * Get the current title for this widget.
    */
    getTitle:function() {
        return "MAAVIS Video Player";
    },

    /**
     * Get the viewport width and height.
     * returns an object with width and height properties.
     */
    getViewport:function() {
	var e = window
	, a = 'inner';
	if ( !( 'innerWidth' in window ) ) {
	    a = 'client';
	    e = document.documentElement || document.body;
	}
	return { width : e[ a + 'Width' ] , height : e[ a + 'Height' ] }
    },

    /**
     * Register a callback function. 
     *
     * type: the name of the type of event to respond to 
     *
     * widget: [optional] the name of the widget where the event must
     * occur for the callback to be executed. This allows callbacks to
     * be register so that they will only respond to events in
     * specific widgets, or to all events.
     */
    register:function(event, callback, widget) {
	if (widget === undefined) {
	    var cbks = MAAVIS_Video_controller.callbacks[event];
	} else {
	    var cbks = MAAVIS_Video_controller.callbacks[widget + "." + event];
	}
	if (cbks === undefined) {
	    cbks = new Array();
	}
	cbks.push(callback);
	MAAVIS_Video_controller.callbacks[event] = cbks;
    },

    /**
     * Execute all the callbacks registered for a given event.
     *
     * The event object is passed directly to the callback function
     * and can contani any number of properties. Two properties that
     * important to the callback functionality are:
     *
     * type: the name of the type of event to respond to 
     *
     * widget: [optional] the name of the widget where the event
     * occured. This allows callbacks to be register so that they will
     * only respond to events in specific widgets, or to all events.
     */
    executeCallbacks:function(event) {
	// Execute all callbacks not restricted to a widget
	var cbks = MAAVIS_Video_controller.callbacks[event.type];
	if (cbks === undefined) return;
	for (var i = 0; i < cbks.length; i++) {
	    cbks[i](event);
	}

	// Execute all callbacks restricted to a widget
	if (event.widget === undefined) return;
	var cbks = MAAVIS_Video_controller.callbacks[event.widget + "." + event.type];
	if (cbks === undefined) return;
	for (var i = 0; i < cbks.length; i++) {
	    cbks[i](event);
	}
    }
};

/**
 * Provides a basic shim for opening the widget without a widget object (e.g. directly in browsers)
 */
if (!window.widget){
    window.widget = {};
}

/**
 * Adds in the "proxify" method if it isn't in the widget object, e.g. as we're opening the widget
 * directly in a browser, or using a widget runtime other than Wookie e.g. Opera, PhoneGap etc
 */
if (!window.widget.proxify){
    window.widget.proxify = function(url){ return url };
}

$('#home').live('pageshow',function(event) {
   MAAVIS_Video_controller.init(); 
});

$('body').bind('orientationchange',function(event){
    MAAVIS_Video_controller.update();
})
var MAAVIS_Video_player_controller = {
    // toggle to indicate if the video is currently playing
    playing: true,
}

$('#home').live('pageshow',function(event) {
    $('.togglePlaying').click(function(event) {
	if ( MAAVIS_Video_player_controller.playing) {
	    MAAVIS_Video_player_controller.playing = false;
	    alert("Stop playing");
	} else {
	    MAAVIS_Video_player_controller.playing = true;
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

