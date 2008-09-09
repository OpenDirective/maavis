'''
pygame channel base class.

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
import urllib2
import mp3
from channel import ChannelBase
import pygame.event
import pygame.mixer
import pygame.locals
import weakref

# maximum number of sound channels allowed
MAX_CHANNELS = 256

# last event id assigned to a channel
last_id = pygame.locals.USEREVENT+1
# mapping from channel event id to channel object
channel_map = weakref.WeakValueDictionary()

def assignIdToChannel(channel):
    global last_id
    id = last_id
    channel_map[id] = channel
    if last_id >= 255:
        # only allowed 255 unique event numbers
        # @todo: not sure what to do when wrapping to prevent conflicts with 
        # channels still in use...
        last_id = pygame.locals.USEREVENT
    last_id += 1
    return id

def getChannelFromId(id):
    return channel_map[id]

class PygameChannelBase(ChannelBase):
    def __init__(self, ch_id):
        ChannelBase.__init__(self, ch_id)
        # queue of utterance word samples
        self.words = []
        # channel player
        self.player = None
        # pygame id used to contact this channel for callbacks
        self.player_id = assignIdToChannel(self)
        # whether we're playing speech or sound
        self.done_action = None
        # set config defaults
        self._initializeConfig()
        # initialize engine
        self._initializeEngine()

    def _initializeConfig(self):
        self.config = {}
        self.config['volume'] = 0.9
        self.config['rate'] = 200
        self.config['loop'] = False

    def _initializeEngine(self):
        # init mixer to values that actually work, not what the tts engine
        # dictates
        pygame.mixer.init(44100, -16, 2)
        # make sure we don't run out of channels easily
        pygame.mixer.set_num_channels(MAX_CHANNELS)

    def shutdown(self):
        self.stop()
        ChannelBase.shutdown(self)
    
    def reset(self):
        # reinitialize local config
        self._initializeConfig()
        # reset tts
        self._initializeEngine()

    def stop(self):
        ChannelBase.stop(self)
        self.done_action = None
        self.words = []
        if self.player:
            self.player.stop()
            self.player = None
    
    def say(self, cmd):
        # make sure the speech string isn't empty; adhere to protocol
        if not len(cmd['text']):
            return

        # start the common response message
        self.name = cmd.get('name')
        if self.name is not None:
            msg = dict(name=self.name)
        else:
            msg = {}

        # find an open player
        self.player = pygame.mixer.find_channel()
        if self.player is None:
            msg['action'] = 'error'
            msg['description'] = 'no free output channel'
            self.observer.pushResponse(msg)
            return

        # configure channel volume
        self.player.set_volume(self.config['volume'])
        # configure channel callback
        self.player.set_endevent(self.player_id)

        # synthesize speech
        self.words = self._synthWords(cmd['text']) #tts.SynthWords(cmd['text'])
                                  
        # create first sound from buffer
        word = self.words.pop(0)
        # ignore if no words
        if word[0] is None:
            return

        # start playing
        self.player.play(word[0])
        # set flags
        self.busy = True
        self.done_action = 'finished-say'

        # notify on start
        msg['channel'] = self.id
        msg['action'] = 'started-say'
        self.observer.pushResponse(msg)
        if word[1] is not None:
            # notify on first word immediately too
            msg['action'] = 'started-word';
            msg['location'] = word[1];
            msg['length'] = word[2];
            self.observer.pushResponse(msg)

    def play(self, cmd):
        print cmd
        # start the common response message
        self.name = cmd.get('name')
        if self.name is not None:
            msg = dict(name=self.name)
        else:
            msg = {}

        # find an open player
        self.player = pygame.mixer.find_channel()
        if self.player is None:
            msg['action'] = 'error'
            msg['description'] = 'no free output channel'
            self.observer.pushResponse(msg)
            return
        # configure channel volume
        self.player.set_volume(self.config['volume'])
        # configure channel callback
        self.player.set_endevent(self.player_id)

        fn = cmd.get('filename')
        if fn is not None:
            # fetch the file from the local disk
            try:
                fh = file(fn, 'rb')
            except IOError:
                msg['action'] = 'error'
                msg['description'] = 'bad sound file'
                msg['filename'] = fn
                self.observer.pushResponse(msg)
                return
            # handle as local where we can seek back to start after trying it
            # as an mp3
            snd = self._soundFromFile(fh)
        else:
            # fetch the file at the url
            try:
                uh = urllib2.urlopen(cmd['url'])
            except urllib2.URLError:
                msg['action'] = 'error'
                msg['description'] = 'bad sound url'
                msg['url'] = cmd['url']
                self.observer.pushResponse(msg)
                return
            # handle as remote where we have to use extension detection because
            # seeking back to start does not work
            snd = self._soundFromURL(uh)
        
        if snd is None:
            msg['action'] = 'error'
            msg['description'] = 'bad sound format'
            msg['url'] = cmd['url']
            # bad sound format, abort
            self.observer.pushResponse(msg)
            return

        # configure looping
        if self.config['loop']:
            loops = -1
        else:
            loops = 0
        self.player.play(snd, loops)
        # set flags
        self.name = cmd.get('name')
        self.busy = True
        self.done_action = 'finished-play'

        # notify on start
        msg['channel'] = self.id
        msg['action'] = 'started-play'
        self.observer.pushResponse(msg)

    def _soundFromFile(self, handle):
        # we can reset a local file stream, so first try as mp3
        try:
            return mp3.MakeSound(handle)
        except Exception, e:
            # seek back to the file start
            handle.seek(0)
        # now try as whatever pygame can support
        try:
            # @todo: does this work in pygame 1.7.1?
            snd = pygame.mixer.Sound(handle)
        except pygame.error:
            snd = None
        return snd

    def _soundFromURL(self, handle):
        # we can't seek backward after reading data from the url stream so we
        # have to check for mp3 at the end of the url as signifying the file
        # type and how to handle it
        if handle.url.endswith('mp3'):
            try:
                # might be an mp3, try to decode
                snd = mp3.MakeSound(handle)
            except Exception, e:
                snd = None
        else:
            try:
                # @todo: does this work in pygame 1.7.1?
                snd = pygame.mixer.Sound(handle)
            except pygame.error:
                snd = None
        return snd

    def getConfig(self, cmd):
        # add all voice names to config
        cfg = dict(voices=self._getVoices())
        cfg.update(self.config)
        self.observer.pushResponse({'action' : 'set-config',
                                    'channel' : self.id,
                                    'config' : cfg})

    def setProperty(self, cmd):
        name = cmd['name']
        val = cmd['value']
        if name == 'rate':
            self._setSpeechRate(val)
        elif name == 'volume':
            if self.player is not None:
                self.player.set_volume(val)
        elif name == 'voice':
            self._setSpeechVoice(val)
        elif name == 'loop':
            # nothing to do; loop is a param on play call
            pass
        else:
            return
        # store in config so we can refer to it later
        self.config[name] = val
        # notify observer
        self.observer.pushResponse({'channel' : self.id, 
                                    'action' : 'set-property',
                                    'name' : name,
                                    'value' : val})

    def onPlayerComplete(self):
        # see if there's more words waiting to be synthesized
        try:
            word = self.words.pop(0)
        except IndexError:
            # no more words, continue
            pass
        else:
            # start playing
            self.player.play(word[0])
            # make sure it's not a bogus message
            if word[2] == 0:
                return
            # notify observer about word start
            msg = {'channel' : self.id, 'action' : 'started-word',
                   'location' : word[1], 'length' : word[2]}
            if self.name is not None:
                msg['name'] = self.name
            self.observer.pushResponse(msg)
            return

        # throw away our player reference
        self.player = None
        msg = {'channel' : self.id, 'action' : self.done_action}
        if self.name is not None:
            msg['name'] = self.name
        # notify the observer
        self.observer.pushResponse(msg)
        # reset stateful data
        self.busy = False
        self.name = None
        self.done_action = None
        # process the queue
        self._processQueue()
