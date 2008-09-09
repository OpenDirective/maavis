'''
espeak and pygame speech and sound interface.

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
import tts
from common.pygchannel import PygameChannelBase, getChannelFromId

class ChannelController(PygameChannelBase):
    def _initializeConfig(self):
        PygameChannelBase._initializeConfig(self)
        self.config['voice'] = tts.DEFAULT_VOICE

    def _initializeEngine(self):
        PygameChannelBase._initializeEngine(self)
        # set tts defaults
        tts.SetVoiceByName(tts.DEFAULT_VOICE)
        tts.SetParameter(tts.RATE, self.config['rate'])

    def _synthWords(self, text):
        return tts.SynthWords(text)

    def _getVoices(self):
        return [v.name for v in tts.ListVoices()]

    def _setSpeechRate(self, val):
        tts.SetParameter(tts.RATE, val)

    def _setSpeechVoice(self, val):
        tts.SetVoiceByName(val)
