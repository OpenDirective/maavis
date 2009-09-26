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
  DWORD mpid;
};

/* Implementation file */
NS_IMPL_ISUPPORTS1(ProcessManager, IProcessManager)

ProcessManager::ProcessManager()
 : mpid(0)
{
  /* member initializers and constructor code */
}

ProcessManager::~ProcessManager()
{
}

/* readonly attribute unsigned long pid; */
NS_IMETHODIMP ProcessManager::GetPid(PRUint32 *aPid)
{
    *aPid = mpid;
    return NS_OK;
}

static void makeWindowTopmost(HWND hwnd)
{
    ::SetWindowPos(hwnd, HWND_TOPMOST, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE | SWP_NOOWNERZORDER | SWP_NOSENDCHANGING);
}

NS_IMETHODIMP ProcessManager::ShowTaskBar(PRBool bShow)
{
    const UINT flag = ((bShow) ? SWP_SHOWWINDOW : SWP_HIDEWINDOW) | SWP_NOACTIVATE | SWP_NOZORDER | SWP_NOOWNERZORDER;
    const HWND hwndStartButton = FindWindow("Button", "Start"); // only on Vista
    const HWND hwndTaskBar = FindWindow("Shell_traywnd", "");
    (void)::SetWindowPos(hwndTaskBar, NULL, 0, 0, 0, 0, flag);
    if (hwndStartButton)
    {
        (void) ::SetWindowPos(hwndStartButton, NULL, 0, 0, 0, 0, flag );
        // force button to reappear - no idea why need this
        (void) SendMessage(hwndStartButton, WM_MOUSEMOVE, 0,  MAKELPARAM(5,5));
    }

  return NS_OK;
}

static BOOL CALLBACK enumProc(HWND hwnd, LPARAM lParam)
{
    if (!IsWindowVisible(hwnd) || IsIconic(hwnd))
        return TRUE;
    
    DWORD pid = 0;
    (void) ::GetWindowThreadProcessId(hwnd, &pid);
/*
    char b[100];
    ::GetWindowText(hwnd, b, 90);
    printf("%Lu %Lu %s\n",(DWORD)lParam, pid, b);
*/
    if (pid ==  (DWORD)lParam)
    {
        makeWindowTopmost(hwnd);
        return FALSE;
    }
    
    return TRUE;
}

NS_IMETHODIMP ProcessManager::MakeMozWindowTopmost(const nsAString & wndName)
{
    char* strName = ToNewUTF8String(wndName); // free this later 
    HWND hwnd = FindWindow("MozillaUIWindowClass", strName);
    NS_Free(strName);

    if (!hwnd)
        return NS_ERROR_FAILURE;

    makeWindowTopmost(hwnd);
    return NS_OK;
}

NS_IMETHODIMP ProcessManager::MakeTopmost()
{
    if (!mpid)
        return NS_ERROR_FAILURE;
    
    EnumWindows(enumProc, mpid);
    
    return NS_OK;
}

/* long start (in AString filename); */
NS_IMETHODIMP ProcessManager::Start(const nsAString & filename, const nsAString & curdir, PRBool *_retval NS_OUTPARAM)
{
  if (mpid)     // single process allowed - nsIProcess was unclear on this
    return NS_ERROR_FAILURE;

  // code to start a process
  STARTUPINFO si;
  PROCESS_INFORMATION pi;

  ZeroMemory( &si, sizeof(si) );
  si.cb = sizeof(si);
  ZeroMemory( &pi, sizeof(pi) );
  
  // it's necessary to convert the type before passing it to CreateProcess
  char* file = ToNewUTF8String(filename); // free this later 
  char* dir = (curdir == nULL) ? NULL : ToNewUTF8String(curdir); // free this later 
  if (*dir == '\0')
      dir = NULL;

  // Start the process 
  BOOL br = CreateProcess( NULL,   // No module name (use command line)
    file,           // Filename to execute plus the arguments 
    NULL,           // Process handle not inheritable
    NULL,           // Thread handle not inheritable
    FALSE,          // Set handle inheritance to FALSE
    0,              // No creation flags
    NULL,           // Use parent's environment block
    dir,           // Use parent's starting directory 
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

  const DWORD pid(mpid);
  mpid = 0; // assume dead whatever happens
  
  HANDLE hProcess = OpenProcess(PROCESS_TERMINATE, false, pid);
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
