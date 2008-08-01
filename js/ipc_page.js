/**
 * Provides a way of transfering arbitrary JSON objects from a HTML-page to a
 * extension
 *
 * For Extension (XUL) - Javascript, see <code>datatransfer.js</code>
 *
 * @author Phil
 * @date 2007/08/23
 * @see http://forums.mozillazine.org/viewtopic.php?t=171216
 * @see http://www.json.org/js.html for JSON support
 */
var Communicator = {
	ELWMS_EVENT_NAME: "ELWMSDataTransferEvent",
	ELWMS_EVENT_BACK_NAME: "ELWMSDataBackchannelEvent",
	ELWMS_CALLER_ID : "elwmsdataelement",
	ELWMS_ELEMENT_NAME : "ELWMSDataElement",
 
	/**
	 * initializes the Element and Listeners
	 *
	 */
	init : function() {
		// create data / event firing Elements
		var element = Communicator.createElement();
		// register custom event on callback
		element.addEventListener(Communicator.ELWMS_EVENT_BACK_NAME, Communicator.calledBack, true);
	},
 
	/**
	 * creates the data element
	 *
	 * @return {HTMLElement} the created Element of the type <code>Communicator.ELWMS_ELEMENT_NAME</code>
	 */
	createElement : function() {
		// may I create an Event?
		if ("createEvent" in document) {
		  	// if element is not yet existing
	  		if (!document.getElementById(Communicator.ELWMS_CALLER_ID)) {
		  		var element = document.createElement(Communicator.ELWMS_ELEMENT_NAME);
		  		element.setAttribute("id", Communicator.ELWMS_CALLER_ID);
		  		// attribute containing "data parameter" for extension call
				element.setAttribute("data", "");
				// attribute containing "return value" of extension
				element.setAttribute("returnvalue", "");
		  		document.documentElement.appendChild(element);
		  		return element;
	  		} else {
	  			// element exists - return that
	  			return document.getElementById(Communicator.ELWMS_CALLER_ID);
	  		}
	  	} else {
	  		// some error...
	  		alert("dataclient.js - Communicator.createElement ERROR!");
	  		return null;
	  	}
	},
 
	/**
	 * calls the extension with JSON - data (object)
	 *
	 * @param {Object} data the data to transfer to extension - must be convertible to JSON
	 */
	call : function(data) {
		// create or get our element
		var element = Communicator.createElement();
		element.setAttribute("data", escape(JSON.stringify(data)));
		// create and fire custom Event to notify extension
		var ev = document.createEvent("Event");
		ev.initEvent(Communicator.ELWMS_EVENT_NAME, true, false);
		element.dispatchEvent(ev);
	},
 
	/**
	 * is called when the extensions fires ELWMS_EVENT_BACK_NAME - Event; data
	 * may be collected from <code>returnvalue</code>-Attribute.
	 *
	 * @param {Event} aEvent the event
	 */
	calledBack : function(aEvent) {
	}
};
 
//EOF