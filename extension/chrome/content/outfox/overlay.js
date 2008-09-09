/*
 * Copyright (c) 2008 Carolina Computer Assistive Technology
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 * */
const GUID = 'outfox@code.google.com';
const ROOT_ID = 'outfox';

utils.declare('outfox.Factory', null, {
    constructor: function() {
	this.page_id = 0;
        this.controllers = {};
	this.page_tokens = {};
        this.tokens = [];
        this.proxy = null;
        this.tokens.push(utils.connect(window, 'load', this, 'initialize'));
	//logit('Factory: created');
    },

    initialize: function(event) {
	// listen for shutdown
	this.tokens.push(utils.connect(window, 'unload', this, 'shutdown'));
	// start listening for page related events
	var ac = document.getElementById('appcontent');
	this.tokens.push(utils.connect(ac, 'pageshow', this, '_onPageLoad'));
        this.tokens.push(utils.connect(ac, 'pagehide', this, '_onPageUnload'));
	var tabs = gBrowser.tabContainer;
	this.tokens.push(utils.connect(tabs, 'TabClose', this, '_onTabClose', false));
	//logit('Factory: initialized');
    },

    shutdown: function(event) {
	// shut down all controllers
	for(var key in this.controllers) {
	    var pc = this.controllers[key];
	    pc.shutdown();
	}
        // unregister all listeners
        this.tokens.forEach(utils.disconnect);
	for(var key in this.page_tokens) {
	    var pt = this.page_tokens[key];
	    utils.disconnect(pt);
	}
        // shutdown the server
        if(this.proxy) {
            this.proxy.shutdown();
	}
	//logit("Factory: shutdown");
    },

    _createController: function(page_id, doc, fs) {
        // make sure we have a speech server started
        if(!this.proxy) {
            this.proxy = new outfox.ServerProxy();
            //logit('Factory: created speech proxy');
        }
        // create a controller object
        var pc = new outfox.PageController(page_id, doc, fs, this.proxy);
        // store controller in conjunction with the document
        this.controllers[page_id] = pc;
        //logit('Factory: created outfox controller');
    },

    _onPageLoad: function(event) {
	var doc = event.originalTarget;
	if(doc.nodeName == '#document') {
	    // attach the page id to the document so we can unregister listeners
	    // later
	    doc.fs_page_id = this.page_id;
	    // web page document loaded, look for the outfox node
	    var fs = doc.getElementById(ROOT_ID);
            if(fs) {
		// node exists, create controller
		this._createController(this.page_id, doc, fs);
            } else {
		// monitor node additions to see if it is added later
		var cb = utils.bind(this, this._onNodeInserted, [this.page_id]);
		this.page_tokens[this.page_id] = utils.connect(doc, 'DOMNodeInserted', cb);
		//logit('Factory: created insert watcher');
	    }
	    // increment no matter what so we can track node watcher hook
	    ++this.page_id;
	}
    },
    
    _onPageUnload: function(event) {
	var doc = event.originalTarget;
        if(doc.nodeName == '#document') {
	    var page_id = doc.fs_page_id;
	    // destroy the node watcher for the document
	    var pt = this.page_tokens[page_id];
	    if(pt) {
		utils.disconnect(pt);
		delete this.page_tokens[page_id];
                //logit('Factory: disconnected insert watcher');
	    }
	    // destroy the controller if one exists for the document
	    var pc = this.controllers[page_id];
	    if(pc) {
                pc.shutdown();
                delete this.controllers[page_id];
                //logit('Factory: destroyed outfox controller');
	    }
        }
    },

    _onTabClose: function(event) {
	var br = gBrowser.getBrowserForTab(event.target);
	var doc = br.contentDocument;
	// spoof a page unload event
	this._onPageUnload({'originalTarget' : doc});
    },

    _onNodeInserted: function(page_id, event) {
	var fs = event.originalTarget;
        if(fs.nodeName == 'DIV' && fs.id == ROOT_ID) {
	    // outfox node added after load
	    // remove the node watcher
	    var pt = this.page_tokens[page_id];
	    utils.disconnect(pt);
	    delete this.page_tokens[page_id];
	    //logit('Factory: disconnected insert watcher');
	    // create the controller
	    this._createController(page_id, fs.ownerDocument, fs);
        }	
    }
});

// allow an instance per window
var fs = new outfox.Factory();
