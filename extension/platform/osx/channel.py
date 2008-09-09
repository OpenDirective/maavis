'''
Cocoa speech and sound interface.

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
from common.channel import ChannelBase
from Foundation import *
from AppKit import *

class ChannelController(NSObject, ChannelBase):
    def initWithId_(self, ch_id):
        self = super(ChannelController, self).init()
        if self:
            # invoke base constructor manually since we're in NSObject land
            ChannelBase.__init__(self, ch_id)
            # speech and sound players
            self.tts = None
            self.sound = None
            # set config defaults
            self._initializeConfig()
        return self

    def _initializeConfig(self):
        self.config = {}
        self.config['voice'] = NSSpeechSynthesizer.defaultVoice()
        self.config['volume'] = 0.9
        self.config['rate'] = 200
        self.config['loop'] = False

    def shutdown(self):
        self.stop()
        self.tts = None
        self.sound = None
        ChannelBase.shutdown(self)
    
    def reset(self):
        # reinitialize local config
        self._initializeConfig()
        if self.tts:
            # reset tts if it exists
            self.tts.setVoice_(self.config['voice'])
            self.tts.setRate_(self.config['rate'])
            self.tts.setVolume_(self.config['volume'])
        if self.sound:
            # reset sound if it exists
            self.sound.setVolume_(self.config['volume'])
            self.sound.setLoops_(self.config['loop'])

    def stop(self):
        ChannelBase.stop(self)
        if self.tts is not None:
            self.tts.stopSpeaking()
        if self.sound is not None:
            self.sound.stop()
    
    def say(self, cmd):
        if not self.tts:
            # build a new synthesizer
            self.tts = NSSpeechSynthesizer.alloc().initWithVoice_(None)
            # register for callbacks
            self.tts.setDelegate_(self)
            # set initial properties
            self.tts.setVoice_(self.config['voice'])
            self.tts.setVolume_(self.config['volume'])
            self.tts.setRate_(self.config['rate'])
        self.tts.startSpeakingString_(cmd['text'])
        self.busy = True
        self.name = cmd.get('name')

        # notify on start
        msg = {'channel' : self.id, 'action' : 'started-say'}
        if self.name is not None:
            msg['name'] = self.name
        self.observer.pushResponse(msg)

    def play(self, cmd):
        fn = cmd.get('filename')
        if fn is not None:
            # allocate new sound object for file
            self.sound = NSSound.alloc().initWithContentsOfFile_byReference_(fn, objc.NO)
        else:
            # allocate a new sound object for URL
            url = NSURL.URLWithString_(cmd['url'])
            self.sound = NSSound.alloc().initWithContentsOfURL_byReference_(url, objc.NO)
        if not self.sound:
            # sound didn't initialize, abort
            self.observer.pushResponse({'action' : 'error',
                                        'description' : 'bad sound url',
                                        'url' : cmd['url']});
            return
        self.sound.setDelegate_(self)
        # set current properties
        self.sound.setVolume_(self.config['volume'])
        self.sound.setLoops_(self.config['loop'])
        self.sound.play()
        self.name = cmd.get('name')
        self.busy = True

        # notify on start
        msg = {'channel' : self.id, 'action' : 'started-play'}
        if self.name is not None:
            msg['name'] = self.name
        self.observer.pushResponse(msg)

    def getConfig(self, cmd):
        # add all voice names to config
        cfg = dict(voices=list(NSSpeechSynthesizer.availableVoices()))
        cfg.update(self.config)
        self.observer.pushResponse({'action' : 'set-config',
                                    'channel' : self.id,
                                    'config' : cfg})

    def setProperty(self, cmd):
        name = cmd['name']
        val = cmd['value']
        if name == 'rate':
            if self.tts:
                self.tts.setRate_(val)
        elif name == 'volume':
            if self.tts:
                self.tts.setVolume_(val)
            if self.sound:
                self.sound.setVolume_(val)
        elif name == 'voice':
            if self.tts:
                self.tts.setVoice_(val)
                # have to reset volume and rate after changing voice
                self.tts.setVolume_(self.config['volume'])
                self.tts.setRate_(self.config['rate'])
        elif name == 'loop':
            if self.sound:
                self.sound.setLoops_(val)
            # @todo: loop support for speech too?
        else:
            return
        # store in config so we can refer to it later
        self.config[name] = val
        # notify observer
        self.observer.pushResponse({'channel' : self.id, 
                                    'action' : 'set-property',
                                    'name' : name,
                                    'value' : val})

    def speechSynthesizer_didFinishSpeaking_(self, tts, success):
        msg = {'channel' : self.id, 'action' : 'finished-say'}
        if self.name is not None:
            msg['name'] = self.name
        # notify the observer
        self.observer.pushResponse(msg)
        # reset stateful data
        self.busy = False
        self.name = None
        # process the queue
        self._processQueue()

    def sound_didFinishPlaying_(self, sound, success):
        # can't reuse the same sound object, so toss it
        self.sound = None
        msg = {'channel' : self.id, 'action' : 'finished-play'}
        if self.name is not None:
            msg['name'] = self.name
        # notify the observer
        if self.observer:
            self.observer.pushResponse(msg)
        # reset stateful data
        self.busy = False
        self.name = None
        # process the queue
        self._processQueue()

    def speechSynthesizer_willSpeakWord_ofString_(self, tts, rng, text):
        msg = {'channel' : self.id, 'action' : 'started-word',
               'location' : rng.location, 'length' : rng.length}
        if self.name is not None:
            msg['name'] = self.name
        # notify the observer
        if self.observer:
            self.observer.pushResponse(msg)
