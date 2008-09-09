'''
Abstract base class for audio speech and sound command processing. Provides
methods shared among all platform implementations.

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

class ChannelBase(object):
    def __init__(self, ch_id):
        # unique id for this channel
        self.id = ch_id
        # observer for channel callbacks
        self.observer = None
        # queue of utterances
        self.queue = []
        # deferred results
        self.deferreds = {}
        # latest deferred request id that stalled the queue
        self.stalled_id = None
        # busy flag; used instead of tts and sound busy methods which are
        # not documented as to when they are set and reset
        self.busy = False
        # name assigned by the client to a speech utterance or sound that
        # can be paired with callback data
        self.name = None

    def _processQueue(self):
        while (not self.busy) and len(self.queue):
            # peek at the top command to see if it is deferred
            cmd = self.queue[0]
            reqid = cmd.get('deferred')
            if reqid is not None:
                # check if the deferred result is already available
                result = self.deferreds.get(reqid)
                if result is None:
                    # store the current request ID
                    self.stalled_id = reqid
                    # and stall the queue for now
                    return
                else:
                    # set the deferred result action to that of the original
                    result['action'] = cmd['action']
                    # remove the deferred from the list of deferreds
                    del self.deferreds[reqid]
                    # use the result instead of the original
                    cmd = result
            # handle the next command
            self._handleCommand(cmd)
            # remember to pop the command
            cmd = self.queue.pop(0)

    def _handleCommand(self, cmd):
        action = cmd.get('action')
        if action == 'say':
            self.say(cmd)
        elif action == 'play':
            self.play(cmd)
        elif action == 'set-queued':
            self.setProperty(cmd)
        elif action == 'get-config':
            self.getConfig(cmd)
        elif action == 'reset-queued':
            self.reset()

    def setObserver(self, ob):
        self.observer = ob

    def pushRequest(self, cmd):
        action = cmd.get('action')
        if action == 'stop':
            # process stops immediately
            self.stop()
        elif action == 'set-now':
            # process immediate property changes
            self.setProperty(cmd)
        elif action == 'reset-now':
            # process immediate reset of all properties
            self.reset()
        elif action == 'deferred-result':
            # process incoming deferred result
            self.deferred(cmd)
        else:
            # queue command; slight waste of time if we immediately pull it back
            # out again, but it's clean
            self.queue.append(cmd)
            # process the queue
            self._processQueue()

    def deferred(self, cmd):
        try:
            reqid = cmd['deferred']
        except KeyError:
            return
        # put the deferred into holding
        self.deferreds[reqid] = cmd
        # check if this deferred is the one that stalled the pipe
        if reqid == self.stalled_id:
            # if so, pump the queue
            self._processQueue()
        # if not, just continue

    def stop(self):
        # reset queue and flags 
        self.queue = []
        self.busy = False
        self.name = None
        # reset deferreds
        self.stalled_id = None
        self.deferreds = {}

    def shutdown(self):
        self.observer = None
