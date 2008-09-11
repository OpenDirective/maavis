'''
Asynchat socket server.

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
import asynchat
import asyncore
import socket

DELIMITER = '\3'

class JSONServer(asynchat.async_chat, object):
    def __init__(self, port):
        asynchat.async_chat.__init__(self)
        self.observer = None
        self.in_buff = []
        self.set_terminator(DELIMITER)
        self.port = port

    def doConnect(self):
        self.create_socket(socket.AF_INET, socket.SOCK_STREAM)
        self.connect(('127.0.0.1', self.port))

    def setObserver(self, ob):
        self.observer = ob

    def sendMessage(self, msg):
        # add delimiter to message
        self.push(msg+DELIMITER)
        print "Tx: " + msg

    def handle_connect(self):
        pass

    def handle_close(self):
        asynchat.async_chat.handle_close(self)
        self.close()
        self.observer.shutdown()

    def handle_expt(self):
        asynchat.async_chat.handle_expt(self)
        # close the socket so we can quit
        self.close()
        self.observer.shutdown()
    
    def handle_error(self):
        asynchat.async_chat.handle_error(self)
        # close the socket so we can quit
        self.close()
        self.observer.shutdown()

    def collect_incoming_data(self, data):
        self.in_buff.append(data)
        
    def found_terminator(self):
        msg = ''.join(self.in_buff)
        print "Rx: " + msg
        self.in_buff = []
        try:
            self.observer.pushRequest(msg)
        except asyncore.ExitNow:
            raise
        except:
            import traceback
            traceback.print_exc()
