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
  DWORD mpid;
};

/* Implementation file */
NS_IMPL_ISUPPORTS1(ProcessManager, IProcessManager)

ProcessManager::ProcessManager()
 : mpid(0)
{
  /* member initializers and constructor code */
  mName.Assign(NS_LITERAL_STRING("Process Manager"));
}

ProcessManager::~ProcessManager()
{
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

/* readonly attribute unsigned long pid; */
NS_IMETHODIMP ProcessManager::GetPid(PRUint32 *aPid)
{
    *aPid = mpid;
    return NS_OK;
}

/* long start (in AString filename); */
NS_IMETHODIMP ProcessManager::Start(const nsAString & filename, PRBool *_retval NS_OUTPARAM)
{
  // code to start a process
  STARTUPINFO si;
  PROCESS_INFORMATION pi;

  ZeroMemory( &si, sizeof(si) );
  si.cb = sizeof(si);
  ZeroMemory( &pi, sizeof(pi) );
  
  // it's necessary to convert the type before passing it to CreateProcess
  char* file = ToNewUTF8String(filename); // free this later 

  // Start the process 
  BOOL br = CreateProcess( NULL,   // No module name (use command line)
    file,           // Filename to execute plus the arguments 
    NULL,           // Process handle not inheritable
    NULL,           // Thread handle not inheritable
    FALSE,          // Set handle inheritance to FALSE
    0,              // No creation flags
    NULL,           // Use parent's environment block
    NULL,           // Use parent's starting directory 
    &si,            // Pointer to STARTUPINFO structure
    &pi );         // Pointer to PROCESS_INFORMATION structure
  NS_Free(file);
  
  if (!br)
  {
    *_retval = false; // REVIEW why return this as error is same
    return NS_ERROR_FAILURE;
  }

  CloseHandle( pi.hProcess );
  CloseHandle( pi.hThread );
  mpid = pi.dwProcessId;
  
  *_retval = true;
  return NS_OK;
}

/* long stop (); */
NS_IMETHODIMP ProcessManager::Stop(PRBool *_retval NS_OUTPARAM)
// note this effectively force quits without allowing for clean shutdown
// REVIEW what if already stopped?
{
  if (!mpid)
    return NS_ERROR_FAILURE;
  
  HANDLE hProcess = OpenProcess(PROCESS_TERMINATE, false, mpid);
  if (!hProcess)
  {
    *_retval = false;
    return NS_OK;
  }
  BOOL br = TerminateProcess(
        hProcess, // handle within the PROCESS_INFORMATION struct 
        9999 // any non-0 value is a failure but application defined, so we pick something that won't often clash (hopefully)
        );
  CloseHandle(hProcess);
  if (!br)
  {
    *_retval = false;
    return NS_OK;
  }
  
  mpid = 0; // this is debatable
  *_retval = (br != 0);
  return NS_OK;
}

NS_IMETHODIMP ProcessManager::IsRunning(PRBool *_retval NS_OUTPARAM)
// _retval = true if exited and exitCode is set otherwise exitcode is undefined (0)
{
  if (!mpid)
  {
    // we don't know 
    *_retval = false;
    return NS_OK;
  }

  HANDLE hProcess = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, false, mpid);
  if (!hProcess)
  {
    *_retval = false;
    return NS_OK;
  }
  DWORD ec = 0;     // TODO pass back via out param. I removed as part of debugging a crash problem
  BOOL br = GetExitCodeProcess(hProcess, &ec);
  CloseHandle(hProcess);
  if (!br)
  {
    *_retval = false;
    return NS_OK;
  }

  *_retval = (ec == STILL_ACTIVE); // nb if proc returns 259 we think it active - 'bug' in win32 api
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
