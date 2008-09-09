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
from common.channel import ChannelBase

# only expect to create one of these (e.g a single channel)
class ChannelController(ChannelBase):
    def __init__(self, ch_id):
        ChannelBase.__init__(self, ch_id)
        self.skype = Skype()  # most things just delegate to this

    def _handleCommand(self, cmd):
        methodname = 'do_' + cmd.get('action')
        if hasattr(self, methodname):
            method = getattr(self, methodname)
            method(cmd)
        else:
            ChannelBase._handleCommand(self, cmd) # really not much point

    def do_launch(self, cmd):
        self.skype.launch()

    def do_call(self, cmd):
        who = cmd.get('who');
        self.skype.call(who)

    def pushMsg(self):
        msg = {}
        msg['action'] = 'error'
        msg['description'] = 'wibble'
        self.observer.pushResponse(msg)
        return


import Skype4Py

class Skype(object):
    def __init__(self):
        self. CallStatus = 0
        self.CallIsFinished = set ([Skype4Py.clsFailed, Skype4Py.clsFinished, Skype4Py.clsMissed, Skype4Py.clsRefused, Skype4Py.clsBusy, Skype4Py.clsCancelled]);
        self.CallIncoming = set([Skype4Py.cltIncomingPSTN, Skype4Py.cltIncomingP2P]);

    def launch(self):
        self.skype = Skype4Py.Skype()
        self.skype.OnAttachmentStatus = self.OnAttach
        self.skype.OnCallStatus = self.OnCall

        # Starting Skype if it's not running already..
        if not self.skype.Client.IsRunning:
            print 'Starting Skype..'
            self.skype.Client.Start()

        # Attatching to Skype..
        print 'Connecting to Skype..'
        self.skype.Attach()

        #skype.SilentMode = 'ON';
        self.skype.Client.Focus()
        self.skype.Client.Minimize()

    def AttachmentStatusText(self, status):
       return self.skype.Convert.AttachmentStatusToText(status)

    def CallStatusText(self, status):
        return self.skype.Convert.CallStatusToText(status)

    def OnCall(self, call, status):
        self.CallStatus = status
        print 'Call status: ' + self.CallStatusText(status)
        
        if status == Skype4Py.clsRinging and ( call.Type in self.CallIncoming):
            print 'Answering Call from ' + call.PartnerHandle
            call.Answer(); 
            
    def OnAttach(self, status):
        print 'API attachment status: ' + self.AttachmentStatusText(status)
        if status == Skype4Py.apiAttachAvailable:
            self.skype.Attach()

    # Creating Skype object and assigning event handlers..
    def call(self, who):

        # Checking if what we got from command line parameter is present in our contact list
        Found = False
        for F in self.skype.Friends:
            if F.Handle == who:
                Found = True
                print 'Calling ' + F.Handle + '..'
                print 'Calling ' + F.Handle + '..'
                self.skype.PlaceCall(who)
                break

        if not Found:
            print 'Call target not found in contact list'
