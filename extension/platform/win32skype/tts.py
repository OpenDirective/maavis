'''
Interface to SAPI with pygame output.

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
from pyTTS import *
import Numeric
import pygame.sndarray

def SynthWords(tts, text, rate=44100, bits=16, channels=2):
    words = []
    stream, events = tts.Speak(text)
    # split buffer into word chunks
    meta = [(e.CharacterPosition, e.Length, e.StreamPosition) 
            for e in events if e.EventType == tts_event_word]
    start = (meta[0][2] & ~1)
    data = stream.GetData()
    # ignore silence before the first word
    x = len(meta) - 1
    if x >= 0:
        for i in xrange(x):
            stream_pos = (meta[i+1][2] & ~1)
            # reshape as needed
            # @todo: correct for bits and rate
            buff = Numeric.fromstring(data[start:stream_pos], Numeric.Int16)
            buff = Numeric.reshape(Numeric.repeat(buff, channels), (-1, 2))
            snd = pygame.sndarray.make_sound(buff)
            words.append((snd, meta[i][0], meta[i][1]))
            start = stream_pos
        # @todo: correct for bits and rate
        end = (len(data) & ~1)
        buff = Numeric.fromstring(data[start:end], Numeric.Int16)
        buff = Numeric.reshape(Numeric.repeat(buff, channels), (-1, 2))
        snd = pygame.sndarray.make_sound(buff)
        words.append((snd, meta[x][0], meta[x][1]))
    else:
        # nothing to speak, so insert a sentinel
        words.append((None, None, None))
    return words

