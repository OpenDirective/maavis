// use mozillas built in JSON
var nativeJSON = Components.classes["@mozilla.org/dom/json;1"]
    .createInstance(Components.interfaces.nsIJSON);

/**
 * Provides a way of transfering arbitrary JSON objects between a HTML-page and
 * the extension; this script is to be inserted in extension code
 *
 * For Client (HTML) - Javascript, see <code>dataclient.js</code>
 *
 * @author Phil
 * @date 2007/08/23
 * @see http://forums.mozillazine.org/viewtopic.php?t=171216
 * @see http://www.json.org/js.html for JSON support
 */
var DataTransferListener = {
	ELWMS_EVENT_NAME: "ELWMSDataTransferEvent",
	ELWMS_EVENT_BACK_NAME: "ELWMSDataBackchannelEvent",
	/**
	 * Listener that subscribes to custom ELWMS Event
	 *
	 * @param {Event} aEvent the event thrown by the HTML Element
	 */
	listenToHTML: function(aEvent) {
		// first we have to check if we allow this... based on URL or what?
		if (aEvent.target.ownerDocument.location.host != "localhost") {
			// TODO: add security here (e.g. from Pref/Setting of applet serving host)!
			// alert("As for security issues only secure HTML pages may pass data to ELWMS extension.");
			// return;
		}
		// data is a escaped JSON String
		var data = nativeJSON.decode(unescape(aEvent.target.getAttribute("data")));
		// what to do with the received data?
		var retval = DataTransferListener.handleData(data, aEvent.target);
		// if back data is given:
		if (retval != null) {
			// add escaped and JSONified Object to <code>returnvalue</code>-Attribute
			aEvent.target.setAttribute("returnvalue", escape(nativeJSON.encode(retval)));
			// fire event to notify HTML-Page of return value
			var ev = window.document.createEvent("Event");
			ev.initEvent(DataTransferListener.ELWMS_EVENT_BACK_NAME, true, false);
			aEvent.target.dispatchEvent(ev);
		}
	},
	/**
	 * this function should handle all arriving data
	 *
	 * @param {Object} data The JSON Object
	 * @param {HTMLNode} target The node that fired the event
	 */
	handleData : function(data, target) {
	}
}
 