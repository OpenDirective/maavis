#!/usr/bin/env python
'''
Build script for Windows.

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
from distutils.core import setup
try:
    import py2exe
except ImportError:
    pass

dll_excludes = [
    'jpeg.dll',
    'libtiff.dll',
    'libpng13.dll',
    'SDL_image.dll',
    'SDL_ttf.dll'
    ]
# @todo: check list against pygame/__init__.py
excludes = [
    'bz2',
    '_ssl',
    '_hashlib',
    'pygame.cdrom', 
    'pygame.draw', 
    'pygame.key',
    'pygame.mouse',
    'pygame.sprite',
    'pygame.surface',
    'pygame.mask',
    'pygame.pixelarray',
    'pygame.overlay',
    'pygame.time',
    'pygame.transform'
    'pygame.font',
    'pygame.sysfont',
    'pygame.movie',
    'pygame.movieext',
    'pygame.scrap',
    'pygame.surfarray',
    'pygame.numpyarray',
    'pygame.image',
    'pygame.imagext'
    ]
typelibs = [('{C866CA3A-32F7-11D2-9602-00C04F8EE628}', 0, 5, 0)]
packages = ['encodings', 'win32']

setup(console=["outfox.py"],
      version='0.1.1',
      options={"py2exe": {"compressed": 1,
                          'optimize': 2,
                          'excludes' : excludes,
                          'dll_excludes': dll_excludes,
                          'typelibs': typelibs,
                          'packages': packages
                          }}
)
