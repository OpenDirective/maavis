'''
Controller for a single document using Firesound.

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
class PageController(object):
    def __init__(self, id, module):
        self.id = id
        self.module = module
        self.channels = {}
        self.observer = None

    def shutdown(self):
        for ch in self.channels.values():
            ch.shutdown()
        self.observer = None

    def setObserver(self, ob):
        self.observer = ob

    def pushRequest(self, cmd):
        # find which channel we're attempting to use
        ch_id = cmd.get('channel', 0)
        try:
            # get an existing
            ch = self.channels[ch_id]
        except KeyError:
            # build a new channel
            ch = self.module.buildChannel(ch_id)
            ch.setObserver(self)
            self.channels[ch_id] = ch
        ch.pushRequest(cmd)

    def pushResponse(self, cmd):
        # inform the observer of the response
        self.observer.pushResponse(self.id, cmd)
