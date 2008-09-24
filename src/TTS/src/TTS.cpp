#include <stdio.h> // for printf for debugging
#include <windows.h> // needed for CreateProcess
#include "ITTS.h" // the CPP .h generated from our .idl
#include "nsIGenericFactory.h" // for NS_GENERIC_FACTORY_CONSTRUCTOR()
#include "nsStringAPI.h" // for nsString
#include <mmsystem.h> // for nsString

#import "progid:SAPI.spVoice" rename_namespace("sapi")
#include <sapi.h>

class TTS : public ITTS
{
public:
  NS_DECL_ISUPPORTS
  NS_DECL_ITTS

  TTS();

private:
  ~TTS();

protected:
  /* additional members */
};

/* Implementation file */
NS_IMPL_ISUPPORTS1(TTS, ITTS)

TTS::TTS()
{
  /* member initializers and constructor code */
}

TTS::~TTS()
{
}

NS_IMETHODIMP TTS::Speak(const nsAString & what)
{
    // TODO review char* not wchar*
    char* strWhat = ToNewUTF8String(what); // free this later 
    try
    {
/*    HRESULT hr = ::CoInitializeEx(NULL, COINIT_APARTMENTTHREADED);
    if (FAILED(hr))
        _com_issue_error(hr);
*/    
        sapi::ISpeechVoicePtr spVoice;
        // TODO see if can get asynch working
        const sapi::SpeechVoiceSpeakFlags flags = static_cast<sapi::SpeechVoiceSpeakFlags>(sapi::SVSFPurgeBeforeSpeak /*| sapi::SVSFlagsAsync*/);
        spVoice.CreateInstance(CLSID_SpVoice); // or perhaps "SAPI.spVoice"
        spVoice->Speak(strWhat, flags);
    }
    catch (_com_error & e)
    {
        _bstr_t bstrSource(e.Source(), false);
        _bstr_t bstrDescription(e.Description(), false );
        wprintf(L"\n Error: %08lx Message: %s Source: %s Description: %s \n", e.Error(), (LPCWSTR)e.ErrorMessage(), (LPCWSTR)bstrSource, (LPCWSTR)bstrDescription);
    }
        
        NS_Free(strWhat);
//    ::CoUninitialize();

    return NS_OK;
}

NS_IMETHODIMP TTS::Stop()
{
    return NS_OK;
}

NS_IMETHODIMP TTS::AlterMasterVolume(const BOOL bDec)
{
    // see http://www.codeproject.com/KB/audio-video/mixerSetControlDetails.aspx
     //MMRESULT result = waveOutSetVolume(0, 0x48444844);
    
    MMRESULT result;
    HMIXER hMixer;
    result = mixerOpen(&hMixer, MIXER_OBJECTF_MIXER, 0, 0, 0);

    MIXERLINE ml = {0};
    ml.cbStruct = sizeof(MIXERLINE);
    ml.dwComponentType = MIXERLINE_COMPONENTTYPE_DST_SPEAKERS;
    result = mixerGetLineInfo((HMIXEROBJ) hMixer, 
             &ml, MIXER_GETLINEINFOF_COMPONENTTYPE);

    MIXERLINECONTROLS mlc = {0};
    MIXERCONTROL mc = {0};
    mlc.cbStruct = sizeof(MIXERLINECONTROLS);
    mlc.dwLineID = ml.dwLineID;
    mlc.dwControlType = MIXERCONTROL_CONTROLTYPE_VOLUME;
    mlc.cControls = 1;
    mlc.pamxctrl = &mc;
    mlc.cbmxctrl = sizeof(MIXERCONTROL);
    result = mixerGetLineControls((HMIXEROBJ) hMixer, 
               &mlc, MIXER_GETLINECONTROLSF_ONEBYTYPE);

    MIXERCONTROLDETAILS mcd = {0};
    MIXERCONTROLDETAILS_UNSIGNED mcdu = {0};

    mcd.cbStruct = sizeof(MIXERCONTROLDETAILS);
    mcd.hwndOwner = 0;
    mcd.dwControlID = mc.dwControlID;
    mcd.paDetails = (LPVOID)&mcdu;
    mcd.cbDetails = sizeof(MIXERCONTROLDETAILS_UNSIGNED);
    mcd.cChannels = 1;
    result = mixerGetControlDetails((HMIXEROBJ) hMixer, 
                   &mcd, MIXER_SETCONTROLDETAILSF_VALUE);

    DWORD level = mcdu.dwValue;
    
    const DWORD NSTEPS = 9;
    const DWORD STEP = 65535 / NSTEPS;
    if (bDec && level > STEP)
        level -= STEP;
    else if (!bDec && level < 65535)
        level += STEP;

    {    
        MIXERCONTROLDETAILS mcd = {0};
        MIXERCONTROLDETAILS_UNSIGNED mcdu = {0};
        mcdu.dwValue = level; // the volume is a number between 0 and 65535

        mcd.cbStruct = sizeof(MIXERCONTROLDETAILS);
        mcd.hwndOwner = 0;
        mcd.dwControlID = mc.dwControlID;
        mcd.paDetails = (LPVOID)&mcdu;
        mcd.cbDetails = sizeof(MIXERCONTROLDETAILS_UNSIGNED);
        mcd.cChannels = 1;
        result = mixerSetControlDetails((HMIXEROBJ) hMixer, 
                       &mcd, MIXER_SETCONTROLDETAILSF_VALUE);
    }
    
    return NS_OK;
}

// This will result in a function named TTSConstructor.
NS_GENERIC_FACTORY_CONSTRUCTOR(TTS)

//     60787882-8620-4e3f-8448-19747874acc8
 
#define TTS_CID \
  {0x60787882, 0x8620, 0x4e3f, \
      { 0x84, 0x48, 0x19, 0x74, 0x78, 0x74, 0xac, 0xc8} }

static const nsModuleComponentInfo components[] =
{
  { "TTS",
    TTS_CID,
    "@fullmeasure.co.uk/tts;1",
    TTSConstructor
  }
};

NS_IMPL_NSGETMODULE(TTSModule, components)
