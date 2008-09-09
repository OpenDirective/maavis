'''
SAPI and pygame speech and sound interface.

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
import math
import tts
from common.pygchannel import PygameChannelBase, getChannelFromId
# exponential regression for wpm; MSMary values used as defaults for unknown
# voices
E_REG = {'MSSam' : (137.89, 1.11),
         'MSMary' : (156.63, 1.11),
         'MSMike' : (154.37, 1.11)}

class ChannelController(PygameChannelBase):
    def __init__(self, ch_id):
        # speech synth
        self.tts = None
        # default voice
        self.default_voice = None
        PygameChannelBase.__init__(self, ch_id)

    def _initializeConfig(self):
        PygameChannelBase._initializeConfig(self)
        self.config['voice'] = self.default_voice

    def _initializeEngine(self):
        PygameChannelBase._initializeEngine(self)
        # build speech synth
        self.tts = tts.Create(output=False)
        self.tts.SetOutputFormat(44, 16, 1)

        voice = self.config['voice']
        if voice is None:
            # when voice is None, store the default
            self.default_voice = self.tts.Voice
            self.config['voice'] = self.default_voice

        # take config values and apply to the speech engine
        self.tts.Voice = self.config['voice']
        a, b = E_REG.get(self.tts.Voice, E_REG['MSMary'])
        self.tts.Rate = int(math.log(self.config['rate']/a, b))
            
    def _synthWords(self, text):
        return tts.SynthWords(self.tts, text)

    def _getVoices(self):
        return self.tts.GetVoiceNames()

    def _setSpeechRate(self, val):
        a, b = E_REG.get(self.tts.Voice, E_REG['MSMary'])
        self.tts.Rate = int(math.log(val/a, b))
    
    def _setSpeechVoice(self):
        # store voice first
        self.config[name] = val
        # have to reinitialize the player to account for voices from
        # different engines with different sampling rates
        self._initializeEngine()
