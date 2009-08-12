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
        self.skype.setObserver(self);

    def _handleCommand(self, cmd):
        methodname = 'do_' + cmd.get('action')
        if hasattr(self, methodname):
            #try:
                method = getattr(self, methodname)
                method(cmd)
            #except (e):
             #   print e.message
        else:
            ChannelBase._handleCommand(self, cmd) # really not much point

    def do_loopback(self, cmd):
        text = cmd.text or ""
        self.observer.pushResponse( { "action": "loopback-response", "text": text } )

    def do_launch(self, cmd):
        self.skype.launch()

    def do_call(self, cmd):
        who = cmd.get('who')
        self.skype.call(who)
        
    def do_endcall(self, cmd):
        self.skype.endCall()

    def do_answercall(self, cmd):
        self.skype.answerCall()

    def do_enablejoys(self, cmd):
        pass

    def pushResponse(self, cmd):
        self.observer.pushResponse(cmd)
        return
        


import Skype4Py
import winGuiAuto as wga

class Skype(object):
    def __init__(self):
        self. CallStatus = 0
        self.CallIsFinished = set ([Skype4Py.clsFailed, Skype4Py.clsFinished, Skype4Py.clsMissed, Skype4Py.clsRefused, Skype4Py.clsBusy, Skype4Py.clsCancelled]);
        self.CallIncoming = set([Skype4Py.cltIncomingPSTN, Skype4Py.cltIncomingP2P]);
        self._theCall = None
        self.observer = None
        
    def setObserver(self, ob): # TODO this seems to be the fave pattern but could multiple inherit 
        self.observer = ob

    def launch(self):
        try:
            self.skype = Skype4Py.Skype()
            self.skype.OnAttachmentStatus = self.OnAttach
            self.skype.OnCallStatus = self.OnCall
            self.skype.OnCallVideoReceiveStatusChanged = self.OnCallVideoReceive
            self.skype.OnCallVideoSendStatusChanged = self.OnCallVideoSend
            self.skype.OnCallVideoStatusChanged = self.OnCallVideo
            
            # Starting Skype if it's not running already..
            if not self.skype.Client.IsRunning:
                print 'Starting Skype..'
                self.skype.Client.Start()

            # Attatching to Skype..
            print 'Connecting to Skype..'
            self.skype.Attach()
            self.skype.ChangeUserStatus(Skype4Py.cusOnline)
        except (Skype4Py.SkypeAPIError, Skype4Py.SkypeError), e:
            print e
            
        #skype.SilentMode = 'ON'; // seems to kill all notifications as well as stop UI alerts

    def AttachmentStatusText(self, status):
       return self.skype.Convert.AttachmentStatusToText(status)

    def CallStatusText(self, status):
        return self.skype.Convert.CallStatusToText(status)

    def OnCallVideoSend(self, call, status):
        print 'Video Send status: ' + status
    def OnCallVideoReceive(self, call, status):
        print 'Video Receive status: ' + status
        if status == Skype4Py.vssRunning:
            self.maximizeVideo()
    def OnCallVideo(self, call, status):
        print 'Video status: ' + status
        if status == Skype4Py.vssRunning:
            self.maximizeVideo()

    def pushCallStatus(self, status, call):
        self.observer.pushResponse( { "action": "call-status", "status": status, "partner": call.PartnerHandle } )
        
    def pushSkypeStatus(xelf, status):
        self.observer.pushResponse( { "action": "skype-status", "status": status } )

    def hideSkype(self):
        self.skype.Client.WindowState = Skype4Py.wndHidden;

    def showSkype(self):
        self.skype.Client.WindowState = Skype4Py.wndMaximized;
        
    def maximizeVideo(self):
        try:
            #import time
            #time.sleep(1)
            hwndSkype = wga.findTopWindow(wantedClass="tSkMainForm.UnicodeClass")
            while True:
                try:
                    hwndVideo = wga.findControl(hwndSkype, wantedClass="tSkLocalVideoControl")
                    break;
                except wga.WinGuiAutoError:
                    pass
            wga.mouseClick(hwndVideo, "left")   # may not be necessary
            while True:
                try:
                    hwndButtons = wga.findControls(hwndVideo, wantedClass="tButtonWithText")
                    if  len(hwndButtons) > 0:
                        break    
                except wga.WinGuiAutoError:
                    pass
            wga.mouseClick(hwndButtons[0], "left")
        except :
            import traceback
            print traceback.print_exc()
            pass

    def OnCall(self, call, status):
        try:
            self.CallStatus = status
            print 'Call status: ' + self.CallStatusText(status)
            
            if status == Skype4Py.clsRinging and ( call.Type in self.CallIncoming):
                self.pushCallStatus("incoming", call )
                
            elif status == Skype4Py.clsInProgress:
                print call.PartnerHandle
                call.StartVideoReceive()
                call.StartVideoSend()
                self.showSkype()
                self.pushCallStatus("inprogress", call)

            else:
                self.hideSkype()
                if status in self.CallIsFinished:
                    self.pushCallStatus("finished", call )
                
        except (Skype4Py.SkypeAPIError, Skype4Py.SkypeError), e:
            print e

    def OnAttach(self, status):
        try:
            print 'API attachment status: ' + self.AttachmentStatusText(status)
            if status == Skype4Py.apiAttachAvailable:
                self.skype.Attach()
            elif status == Skype4Py.apiAttachSuccess:
                self.hideSkype();
        except (Skype4Py.SkypeAPIError, Skype4Py.SkypeError), e:
            print e
        
    def call(self, who):
        try:
            print 'Calling ' + who + '...'
            self.skype.PlaceCall(who)
        except (Skype4Py.SkypeAPIError, Skype4Py.SkypeError), e:
            print e

    def endCall(self):
        # assume only 1 call
        try:
            self.skype.ActiveCalls[0].Finish()
        except (Skype4Py.SkypeAPIError, Skype4Py.SkypeError), e:
            print e
        except IndexError:
            pass
        
    def answerCall(self):
        try:
            self.skype.ActiveCalls[0].Answer()
        except (Skype4Py.SkypeAPIError, Skype4Py.SkypeError), e:
            print e
        except IndexError:
            pass
 