'''
Cocoa socket server.

Copyright (c) 2008 Carolina Computer Assistive Technology

Permission to use, copy, modify, and distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
'''
import objc
from Foundation import *
from AppKit import *
from PyObjCTools import AppHelper

DELIMITER = '\3'

class JSONServer(NSObject):
    def initWithPort_(self, port):
        self = super(JSONServer, self).init()
        if self:
            self.port = port
            self.in_str = None
            self.out_str = None
            # dispatch table
            self.dispatch_table = {
                NSStreamEventOpenCompleted : self.onOpenCompleted_,
                NSStreamEventHasBytesAvailable : self.onHasBytes_,
                NSStreamEventHasSpaceAvailable : self.onHasSpace_,
                NSStreamEventErrorOccurred : self.onErrorOccurred_,
                NSStreamEventEndEncountered : self.onEndEncountered_
                }
            # outgoing queue
            self.out_buff = []
            # incoming queue
            self.in_buff = []
            self.has_space = False
            self.observer = None                
        return self

    def doConnect(self):
        # get streams
        host = NSHost.hostWithAddress_('127.0.0.1')
        self.in_str, self.out_str = NSStream.getStreamsToHost_port_inputStream_outputStream_(host, self.port, None, None)
        # register for stream callbacks
        self.in_str.setDelegate_(self)
        self.out_str.setDelegate_(self)
        # schedule callbacks as part of the main loop
        self.in_str.scheduleInRunLoop_forMode_(NSRunLoop.currentRunLoop(),
                                               NSDefaultRunLoopMode)
        self.out_str.scheduleInRunLoop_forMode_(NSRunLoop.currentRunLoop(),
                                                NSDefaultRunLoopMode)
        # open the streams
        self.in_str.open()
        self.out_str.open()

    def _sendUntil(self):
        while 1:
            try:
                msg = self.out_buff.pop(0)
            except IndexError:
                break
            sent = self.out_str.write_maxLength_(msg, len(msg))
            if sent < len(msg):
                self.out_buff.insert(0, msg[sent:])
                break

    def setObserver(self, ob):
        self.observer = ob

    def sendMessage(self, msg):
        # add delimiter to message
        self.out_buff.append(msg+DELIMITER)
        if self.has_space:
            self._sendUntil()

    def stream_handleEvent_(self, stream, event):
        try:
            method = self.dispatch_table[event]
        except KeyError:
            return
        method(stream)

    def onOpenCompleted_(self, stream):
        pass

    def onEndEncountered_(self, stream):
        self.in_str.close()
        self.out_str.close()
        self.observer.shutdown()

    def onErrorOccurred_(self, stream):
        self.in_str.close()
        self.out_str.close()
        self.observer.shutdown()

    def onHasBytes_(self, stream):
        size, bytes = stream.read_maxLength_(None, 512)
        if(size <= 0): return
        bytes = bytes[:size]

        # look for message delimiter
        segs = bytes.split(DELIMITER)
        if len(segs) > 0:
            # if we have previous data, join first received chunk to end
            # of previous data
            segs[0] = ''.join(self.in_buff) + segs[0]
            # reset input buffer
            self.in_buff = []
            # loop over all commands except the last which can't be complete
            for i in xrange(len(segs) - 1):
                msg = segs[i]
                # notify observer of the complete command
                self.observer.pushRequest(msg)
            # save any leftovers
            self.in_buff.append(segs[-1])
        else:
            # save the data for later
            self.in_buff.extend(segs)

    def onHasSpace_(self, stream):
        # loop through all waiting commands until we get short send
        if len(self.out_buff):
            self.has_space = False
            self._sendUntil()
        else:
            self.has_space = True
        
