'''
Channel shared interface to espeak singleton.

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
from espeak import *
import Numeric
import pygame.sndarray

# init speech synth
SAMPLING_RATE = Initialize(AUDIO_OUTPUT_SYNCHRONOUS, 500)
# get default voice
DEFAULT_VOICE = GetCurrentVoice().contents.name

def SynthWords(text, rate=44100, bits=16, channels=2):
    chunks = []
    meta = []

    bit_mult = bits / 8
    
    def synth_cb(wav, numsample, events):
        if numsample > 0:
            # 16 bit samples
            chunk = ctypes.string_at(wav, numsample*bit_mult)
            chunks.append(chunk)
        # store all events for later processing
        i = 0
        while True:
            event = events[i]
            if event.type == EVENT_LIST_TERMINATED:
                break
            elif event.type == EVENT_WORD:
                # position seems to be 1 based, not 0
                meta.append((event.text_position-1, event.length, 
                             event.sample*bit_mult))
            i += 1
        return 0

    SetSynthCallback(synth_cb)
    Synth(text)

    rate_mult = rate/SAMPLING_RATE

    # split into word chunks
    words = []
    data = ''.join(chunks)
    start = meta[0][2]
    x = len(meta) - 1
    if x >= 0:
        for i in xrange(x):
            stream_pos = meta[i+1][2]
            # reshape as needed
            # @todo: correct for bits
            buff = Numeric.fromstring(data[start:stream_pos], Numeric.Int16)
            buff = Numeric.reshape(Numeric.repeat(buff, rate_mult*channels), 
                                   (-1, 2))
            snd = pygame.sndarray.make_sound(buff)
            words.append((snd, meta[i][0], meta[i][1]))
            start = stream_pos
        # @todo: correct for bits
        buff = Numeric.fromstring(data[start:], Numeric.Int16)
        buff = Numeric.reshape(Numeric.repeat(buff, rate_mult*channels), 
                               (-1, 2))
        snd = pygame.sndarray.make_sound(buff)
        words.append((snd, meta[x][0], meta[x][1]))
    else:
        # nothing to speak, so fake a word
        words.append((None, None, None))

    return words

