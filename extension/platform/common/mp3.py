'''
Code to support MP3 decode for pygame playback using pymedia.

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
import pymedia.audio.acodec
import pymedia.muxer
import Numeric
import pygame.sndarray

def MakeSound(fh, rate=44100, bits=16, channels=2):
    dm = pymedia.muxer.Demuxer('mp3')
    s = fh.read()
    frames = dm.parse(s)
    dec = pymedia.audio.acodec.Decoder(dm.streams[0])
    segs = []
    for fr in frames:
        r = dec.decode(fr[1])
        if r and r.data:
            seg = Numeric.fromstring(str(r.data), Numeric.Int16)
            segs.append(seg)

    ch_mult = channels / r.channels
    rate_mult = rate / r.sample_rate
    buff = Numeric.concatenate(segs)
    buff = Numeric.reshape(Numeric.repeat(buff, int(rate_mult * ch_mult)),
                           (-1, 2))
    return pygame.sndarray.make_sound(buff)
