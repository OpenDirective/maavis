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

def buildServer(port):
    return JSONServer(port)

def buildChannel(ch_id):
    return channel.ChannelController(ch_id)

def shutdown():
    raise asyncore.ExitNow
     
def run():
    try:
        while 1:
        # poll asyncore
            asyncore.poll(0.1); # TODO should we limit sockets? with MAP
            
    except asyncore.ExitNow:
        pass