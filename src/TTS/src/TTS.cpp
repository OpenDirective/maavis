#include <stdio.h> // for printf for debugging
#include <windows.h> // needed for CreateProcess
#include "ITTS.h" // the CPP .h generated from our .idl
#include "nsIGenericFactory.h" // for NS_GENERIC_FACTORY_CONSTRUCTOR()
#include "nsStringAPI.h" // for nsString

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
