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
utils.declare('outfox.CacheController', null, {
    constructor: function() {
	var cs = Components.classes["@mozilla.org/network/cache-service;1"].getService(Components.interfaces.nsICacheService);
	this.fs = Components.classes["@mozilla.org/prefetch-service;1"].getService(Components.interfaces.nsIPrefetchService);
	this.ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
	this.nsic = Components.interfaces.nsICache;
	this.sess = cs.createSession('HTTP', this.nsic.STORE_ON_DISK,
				     this.nsic.STREAM_BASED);
	// @todo: need second session for non-stream based resources
	this.reqid = 0;
    },

    getLocalFilename: function(url) {
	// get canonical url to match with cache
	var uri = this.ios.newURI(url, null, null);
	url = uri.asciiSpec;
	try {
	    var entry = this.sess.openCacheEntry(url, this.nsic.ACCESS_READ,
		this.nsic.BLOCKING);
	} catch(e) {
	    return null;
	}
	var target = entry.file.path;
	//logit('*** CACHE FILE', target);
	entry.close();
	return target;
    },

    fetch: function(url, observer) {
	// get canonical url
	var uri = this.ios.newURI(url, null, null);
	url = uri.asciiSpec;
	//logit('*** FETCHING', url);

	var reqid = this.reqid++;
	var req = new XMLHttpRequest();
	req.mozBackgroundRequest = true;
	req.open('GET', url, true);
	// define a callback for asynchronous cache entry opening
	// can't do sync within the ready state change context because the
	//  cache entry is still held open by the xhr in there (deadlock!)
	var cache_obs = {
	    onCacheEntryAvailable: function(entry, access, status) {
		// invoke the external observer with the filename
		observer(reqid, entry.file.path);
	    }
	};
	var self = this;
	req.onreadystatechange = function(event) {
	    if(req.readyState == 4) {
		// http gives 200 on success, ftp or file gives 0
		if(req.status == 200 || req.status == 0) {
		    // fetch the info from the cache asynchronously
		    setTimeout(function() {
			try {
			    self.sess.asyncOpenCacheEntry(url, 
							  self.nsic.ACCESS_READ,
							  cache_obs);
			} catch (e) {
			    // still need to callback with null so deferred
			    // requests can be fulfilled
			    observer(reqid, null);
			}
		    }, 0);
		} else {
		    // still need to callback with null as the filename so any
		    // deferred requests can be fulfilled
		    observer(reqid, null);
		}
	    }
	};
	req.send(null);
	return reqid;
    }
});
