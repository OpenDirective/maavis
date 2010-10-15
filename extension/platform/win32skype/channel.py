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
import win32gui
import win32con
from time import sleep
from SendKeys import SendKeys
import Skype4Py

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
        portablepath = cmd.get('portablepath')
        self.skype.launch(portablepath)

    def do_call(self, cmd):
        who = cmd.get('who')
        self.skype.call(who)
        
    def do_endcall(self, cmd):
        self.skype.endCall()

    def do_answercall(self, cmd):
        self.skype.answerCall()

    def do_videoTest(self, cmd):
        self.skype.videoTest()
        
    def do_enablejoys(self, cmd):
        pass

    def pushResponse(self, cmd):
        self.observer.pushResponse(cmd)
        return
        
class Skype(object):
    def __init__(self):
        self. CallStatus = 0
        self.CallIsFinished = set ([Skype4Py.clsFailed, Skype4Py.clsFinished, Skype4Py.clsMissed, Skype4Py.clsRefused, Skype4Py.clsBusy, Skype4Py.clsCancelled]);
        self.CallIncoming = set([Skype4Py.cltIncomingPSTN, Skype4Py.cltIncomingP2P]);
        self._theCall = None
        self.observer = None
       
    def setObserver(self, ob): # TODO this seems to be the fave pattern but could multiple inherit 
        self.observer = ob

    def launch(self, portablepath):
        try:
            self.skype = Skype4Py.Skype()
            self.skype.OnAttachmentStatus = self.OnAttach
            self.skype.OnCallStatus = self.OnCall
            self.skype.OnCallVideoReceiveStatusChanged = self.OnCallVideoReceive
            self.skype.OnCallVideoSendStatusChanged = self.OnCallVideoSend
            self.skype.OnCallVideoStatusChanged = self.OnCallVideo
            self.skype.OnError = self.OnError

            #these 2 are for extra debug info
            self.skype.OnClientWindowState = self.OnClientWindowState
            self.skype.OnCommand = self.OnCommand
            
            # Starting Skype if it's not running already..
            if not self.skype.Client.IsRunning:
                print 'Starting Skype..'
                try:
                    if portablepath:
                        # Alter Skype4Py to use portablepath
                        # should only ever happen once - poor assumption
                        oldmeth = Skype4Py.api.SkypeAPI.get_skype_path
                        def newmeth(self):
                          from ctypes import c_char_p
                          return c_char_p(portablepath)
                        Skype4Py.api.SkypeAPI.get_skype_path = newmeth

                    self.skype.Client.Start(Minimized=True, Nosplash=True)
                except Skype4Py.SkypeAPIError, e:
                    print 'Skype not installed'
                    self.pushSkypeStatus('not_installed')

            # Attaching to Skype..
            print 'Connecting to Skype..'
            self.skype.Attach()
            self.skype.ChangeUserStatus(Skype4Py.cusOnline)
            self.rxvid = 0
            self.incoming = False
        except (Skype4Py.SkypeAPIError, Skype4Py.SkypeError), e:
            print e
            
        #skype.SilentMode = 'ON'; // seems to kill all notifications as well as stop UI alerts

    def AttachmentStatusText(self, status):
       return self.skype.Convert.AttachmentStatusToText(status)

    def CallStatusText(self, status):
        return self.skype.Convert.CallStatusToText(status)

    def pushCallStatus(self, status, call):
        self.observer.pushResponse( { "action": "call-status", "status": status, "partner": call.PartnerHandle } )
        
    def pushError(self, command, number, description):
        if command is None:
            cmd = 'None'
        else:
            cmd = command.Command
        self.observer.pushResponse( { "action": "skype-error", "command": cmd, "number": number, "description": description } )
        
    def pushSkypeStatus(self, status):
        self.observer.pushResponse( { "action": "skype-status", "status": status } )

    def hideSkype(self):
        self.skype.Client.WindowState = Skype4Py.wndHidden;

    def showSkype(self):
        self.skype.Client.WindowState = Skype4Py.wndNormal;
    
    def HideCallNotificationDialog(self):
        sleep(1)
        
        # Hide the skype call alert window
        hWnd = win32gui.FindWindowEx(0, 
                                     0, 
                                     "TCallNotificationWindow", 
                                     None)
        win32gui.SetWindowPos(hWnd, win32con.HWND_BOTTOM, 0, 0, 0, 0, win32con.SWP_NOACTIVATE)

    def maximizeVideo(self):
        if self.rxvid == 0:
            self.showSkype()
            self.skype.Client.OpenCallHistoryTab()
            sleep(1)
        SendKeys("{ENTER}") # force video in all cases - specifically in default view with nothing useful in right pane
        sleep(1)
        SendKeys("%{ENTER}") # doesn't work if video not show at all - no way in skype api to force it to show
        self.rxvid += 1

    def KillCallQualityDialog(self):
        sleep(1)
        hWnd = win32gui.FindWindowEx(0, 
                                     0, 
                                     "TCallQualityForm.UnicodeClass", 
                                     '')
        SendKeys("{ESC}") 
    
    def OnError(self, command, number, description):
        self.pushError(command, number, description)

    def OnCommand(self, command):
        print 'Command: ' + command.Command
        
    def OnClientWindowState(self, state):
        print 'Client Window State: ' + state
    
    def OnCallVideoSend(self, call, status):
        print 'Video Send status: ' + status
 
    def OnCallVideoReceive(self, call, status):
        print 'Video Receive status: ' + status
        if status == Skype4Py.vssRunning:
            self.maximizeVideo()

    def OnCallVideo(self, call, status):
        print 'Video status: ' + status
        if status in [Skype4Py.cvsSendEnabled, Skype4Py.cvsBothEnabled]:
            call.StartVideoSend()
        if status in [Skype4Py.cvsReceiveEnabled, Skype4Py.cvsBothEnabled]:
            call.StartVideoReceive()

    def OnCall(self, call, status):
        try:
            self.CallStatus = status
            print 'Call status: ' + self.CallStatusText(status)

            if status == Skype4Py.clsRinging and ( call.Type in self.CallIncoming):
                print call.PartnerHandle
                self.pushCallStatus("incoming", call )
                self.incoming = True
                self.HideCallNotificationDialog()
                
            elif status == Skype4Py.clsInProgress:
                print call.PartnerHandle
                self.pushCallStatus("inprogress", call)
                if self.incoming:
                    self.showSkype()
                    self.incoming=False

            elif status == Skype4Py.clsRinging:
                print call.PartnerHandle
                self.pushCallStatus("ringing", call)

            else:
                if status in self.CallIsFinished:
                    self.skype.Client.OpenContactsTab()
                    self.hideSkype()
                    self.pushCallStatus("finished", call )
                    self.rxvid = 0
                
        except (Skype4Py.SkypeAPIError, Skype4Py.SkypeError), e:
            print e

    def OnAttach(self, status):
        try:
            print 'API attachment status: ' + self.AttachmentStatusText(status)
            if status == Skype4Py.apiAttachPendingAuthorization:
                self.pushSkypeStatus('attach_authorise')
                self.showSkype() # doesn't work
            elif status == Skype4Py.apiAttachAvailable:
                self.pushSkypeStatus('attach_available')
            elif status == Skype4Py.apiAttachSuccess:
                self.pushSkypeStatus('attach_success')
                self.hideSkype()
        except (Skype4Py.SkypeAPIError, Skype4Py.SkypeError), e:
            print e
        
    def call(self, who):
        try:
            print 'Calling ' + who + '...'
            call = self.skype.PlaceCall(who)
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
 
    def videoTest(self):
        try:
            call = self.skype.Client.OpenVideoTestDialog()
        except (Skype4Py.SkypeAPIError, Skype4Py.SkypeError), e:
            print e
