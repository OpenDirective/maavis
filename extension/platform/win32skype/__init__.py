'''
Asyncore socket server, SAPI speech, and pygame sound/mixer for Windows.

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
import os
from common.server import JSONServer
import channel
import asyncore
import switch

def buildServer(port):
    return JSONServer(port)


# TODO refactor this hack to get joy integration - assume called only once
_joy_channel = None
def buildChannel(ch_id):
    print(ch_id)
    if ch_id == "2000":
        switch.init()
        global _joy_channel
        _joy_channel = channel.ChannelController(ch_id)
        return _joy_channel
    else:
        return channel.ChannelController(ch_id)

def shutdown():
    raise asyncore.ExitNow
     
def run():
    try:
        while 1:
            # poll joystick buttons
            if _joy_channel != None:
                event, joy, button = switch.getEvent()
                if event != switch.NO_EVENT:
                    _joy_channel.pushResponse( { "action": "button-status", "status": event, "joy": joy, "button": button } )
 
            # poll asyncore 
            # deliberately always call for joystick polling
            asyncore.poll(0.1) # TODO should we limit sockets? with MAP
            
    except asyncore.ExitNow:
        pass