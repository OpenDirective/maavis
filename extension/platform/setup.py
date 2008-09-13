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
    ]
packages = ['encodings', 'win32skype', 'Skype4Py']
#includes = ['Skype4Py.API.ICommand']

maavis_skype_server = {
    # for the versioninfo resources
    "version" : "0.1.0",
    "company_name" : "Fullmeasure",
    "copyright" : "Copyright 2008 Fullmeasure",
    "name" : "Maavis Skype Server",
    "description" : "Maavis Skype Server",

    "script" : "outfox.py",
    "dest_base" :"MaavisSkypeServer"   # .exe name
}

setup(name='Outfox for Skype',
      version='0.1.0',
      description='Mavis skype server. Based on  Outfox server from CCAT',
      author='Steve Lee, CCAT',
      console=[maavis_skype_server],
      options={"py2exe": {"compressed": 1,
                          'optimize': 2,
                          'excludes' : excludes,
#                          'includes' : includes,
                          'dll_excludes': dll_excludes,
                          'packages': packages
                          }}
)
