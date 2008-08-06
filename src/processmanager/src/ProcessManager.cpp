#include <stdio.h> // for printf for debugging
#include <windows.h> // needed for CreateProcess
#include "IProcessManager.h" // the CPP .h generated from our .idl
#include "nsIGenericFactory.h" // for NS_GENERIC_FACTORY_CONSTRUCTOR()
#include "nsStringAPI.h" // for nsString

class ProcessManager : public IProcessManager
{
public:
  NS_DECL_ISUPPORTS
  NS_DECL_IPROCESSMANAGER

  ProcessManager();

private:
  ~ProcessManager();

protected:
  /* additional members */
  nsString mName;
  PROCESS_INFORMATION pi; // this is the pointer to the process; use it to terminate the process

};

/* Implementation file */
NS_IMPL_ISUPPORTS1(ProcessManager, IProcessManager)

ProcessManager::ProcessManager()
{
  /* member initializers and constructor code */
  mName.Assign(NS_LITERAL_STRING("Process Manager"));
}

ProcessManager::~ProcessManager()
{
  /* destructor code */
}

/* attribute AString name; */
NS_IMETHODIMP ProcessManager::GetName(nsAString & aName)
{
  aName.Assign(mName);
  printf("ProcessManager::GetName\n");
  return NS_OK;
//  return NS_ERROR_NOT_IMPLEMENTED;
}
NS_IMETHODIMP ProcessManager::SetName(const nsAString & aName)
{
  mName.Assign(aName);
  printf("ProcessManager::SetName\n");
  return NS_OK;
//  return NS_ERROR_NOT_IMPLEMENTED;
}

/* long start (in AString filename); */
NS_IMETHODIMP ProcessManager::Start(const nsAString & filename, PRInt32 *_retval)
{
  // code to start a process
  STARTUPINFO si;
  //  PROCESS_INFORMATION pi; // defined up in the protected section as we'll need it in scope as long as this object exists

  ZeroMemory( &si, sizeof(si) );
  si.cb = sizeof(si);
  ZeroMemory( &pi, sizeof(pi) );
  
  // it's necessary to convert the type before passing it to CreateProcess
  char* file = ToNewUTF8String(filename); // free this later 

  // Start the process 
  if( !CreateProcess( NULL,   // No module name (use command line)
    file,           // Filename to execute plus the arguments 
    NULL,           // Process handle not inheritable
    NULL,           // Thread handle not inheritable
    FALSE,          // Set handle inheritance to FALSE
    0,              // No creation flags
    NULL,           // Use parent's environment block
    NULL,           // Use parent's starting directory 
    &si,            // Pointer to STARTUPINFO structure
    &pi )           // Pointer to PROCESS_INFORMATION structure
  ) 
  {
    *_retval = 1;
    return NS_ERROR_FAILURE;
  }
  *_retval = 0;
  return NS_OK;
}

/* long stop (); */
NS_IMETHODIMP ProcessManager::Stop(PRInt32 *_retval)
{
  TerminateProcess(
    pi.hProcess, // handle within the PROCESS_INFORMATION struct 
    NULL // I just guessed for this value
  );

  *_retval = 0;
  return NS_OK;
}

// This will result in a function named ProcessManagerConstructor.
NS_GENERIC_FACTORY_CONSTRUCTOR(ProcessManager)

// 19f3ef5e-759f-49a4-88e3-ed27f9c83011 
#define PROCESSMANAGER_CID \
  {0x19f3ef5e, 0x759f, 0x49a4, \
      { 0x88, 0xe3, 0xed, 0x27, 0xf9, 0xc8, 0x30, 0x11} }

static const nsModuleComponentInfo components[] =
{
  { "ProcessManager",
    PROCESSMANAGER_CID,
    "@senecac.on.ca/processmanager;1",
    ProcessManagerConstructor
  }
};

NS_IMPL_NSGETMODULE(ProcessManagerModule, components)

