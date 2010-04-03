[Setup]
AppName=Maavis
AppVerName=Maavis 0.1.10
OutputBaseFilename=Maavis-0.1.10
AppVersion=0.1.10
VersioninfoVersion=0.1.10
; Developed by Steve Lee of Full Measure.
AppPublisher=Full Measure for the University Of Sheffield
AppCopyright=Copyright (C) 2008,2009,2010 The University Of Sheffield
AppPublisherURL=http://fullmeasure.co.uk
AppSupportURL=http://maavis.fullmeasure.co.uk
DefaultGroupName=Maavis
;LicenseFile=GPL.txt
DefaultDirName={pf}\Maavis
PrivilegesRequired=admin
SetupIconFile=Maavis.ico

;Note the Firefox and Skype installer filenames are defined at the end of this file

; max compression - slower, not recommended over around 100 MB
;SolidCompression=true

[Messages]
WelcomeLabel1=This will install [name/ver].
WelcomeLabel2=The Mozilla Firefox web browser will also be installed.%n%nIf you already use Firefox you must ensure it is not running.%n%nYou should close all other programs before continuing to install [name] for the current user.%n%nSkype can be installed to provide video conferencing.
ClickFinish=Click Finish to exit Setup after unchecking any of the following that you do not want to happen.

[Tasks]
Name: "firefox"; Description: "Install &Firefox. This is required unless you already have the correct version. You can always continue to use your current web browser. There is check box in the Firefox installer that controls if Firefox becomes your default browser."; Flags: "checkedonce"
;Name: "media"; Description: "Install example &media for Maavis"; flags: "checkedonce"
Name: "turnkey"; Description: "Run Maavis &automatically whenever this user logs on to Windows"; Flags: unchecked
Name: "desktopicon"; Description: "Put an icon on the desktop for &Maavis"; GroupDescription: "Icons:";
Name: "desktopiconmedia"; Description: "Put an icon on the desktop to &change Maavis photos, music and videos"; GroupDescription: "Icons:";
Name: "desktopiconcfg"; Description: "Put an icon on the desktop to change how Maavis &looks"; GroupDescription: "Icons:";
;Name: quicklaunchicon; Description: "Create a &Quick Launch icon"; GroupDescription: "Additional icons:"; MinVersion: 0,5.01; Flags: unchecked


[Files]
; we might expect *.* to copy *this* file too but looks Inno like writes to temp file 1st so not a problem
Source: "..\extension\*"; DestDir: "{app}\extension"; Excludes: "\platform"; Flags: recursesubdirs ignoreversion
Source: "..\extension\platform\dist\*"; DestDir: "{app}\platform\dist\extension"; Flags: ignoreversion
Source: "GPL.txt"; DestDir: "{app}"; Flags: ignoreversion
Source: "Credits and attribution.txt"; DestDir: "{app}"; Flags: ignoreversion
Source: "Maavis.ico"; DestDir: "{app}"; Flags: ignoreversion

; MaavisSkypeServer
Source: "..\extension\platform\dist\*"; DestDir: "{app}\extension\platform\dist"; Flags: recursesubdirs ignoreversion

; copy the non debug version of prefs.js
;Source: "..\extension\defaults\preferences\prefs_deploy.js"; DestDir: "{app}\extension\defaults\preferences"; Flags: ignoreversion

; Installers
Source: ".\skype*"; DestDir: "{app}\installers"; Flags: ignoreversion
Source: ".\firefox*"; DestDir: "{app}\installers"; Flags: ignoreversion

; Media
;Source: "..\media\*"; DestDir: "{userdocs}\MaavisMedia"; Flags: recursesubdirs ignoreversion; Tasks: "media"
Source: "..\media\*"; DestDir: "{app}\media"; Flags: recursesubdirs ignoreversion;


[INI]
Filename: "{app}\Maavis.url"; Section: "InternetShortcut"; Key: "URL"; String: "www.maavis.co.uk"
Filename: "{app}\ACT.url"; Section: "InternetShortcut"; Key: "URL"; String: "www.actprogramme.org.uk"
Filename: "{app}\FullMeasure.url"; Section: "InternetShortcut"; Key: "URL"; String: "fullmeasure.co.uk"
Filename: "{app}\MozillaEurope.url"; Section: "InternetShortcut"; Key: "URL"; String: "www.mozilla-europe.org"

[Icons]
; programs in start menu
Name: "{group}\Maavis"; Filename: "{pf}\Mozilla Firefox\firefox.exe"; parameters: "-P Maavis -no-remote "; Comment: "Run Maavis."; IconFilename: "{app}\Maavis.ico"
Name: "{group}\Maavis Login"; Filename: "{pf}\Mozilla Firefox\firefox.exe"; parameters: "-P Maavis -no-remote -login"; Comment: "Run Maavis Login."; IconFilename: "{app}\Maavis.ico"
Name: "{group}\Maavis Media"; Filename: "explorer"; parameters: "{userdocs}\MaavisMedia\Users\default"; Comment: "Open Media folder where photos, music and videos are found."; IconFilename: "{app}\Maavis.ico"
Name: "{group}\Maavis Settings"; Filename: "{pf}\Mozilla Firefox\firefox.exe"; parameters: "-P ""Maavis"" -config -no-remote"; Comment: "Change how Maavis looks and behaves"; IconFilename: "{app}\Maavis.ico"
Name: "{group}\Speech Settings"; Filename: "control"; parameters: "speech"; Comment: "Change speech settings"
; web links in start menu
Name: "{group}\Maavis website"; Filename: "{app}\Maavis.url"; Comment: "Visit the Maavis website"
Name: "{group}\ACT website"; Filename: "{app}\ACT.url"; Comment: "Visit the ACT website"
Name: "{group}\Mozilla Europe website"; Filename: "{app}\MozillaEurope.url"; Comment: "Visit the Mozilla Europe website"
Name: "{group}\Full Measure website"; Filename: "{app}\FullMeasure.url"; Comment: "Visit the Full Measure website"

; desktop - optional
Name: "{userdesktop}\Maavis"; Filename: "{pf}\Mozilla Firefox\firefox.exe"; parameters: "-P Maavis -no-remote"; Comment: "Run Maavis";  IconFilename: "{app}\Maavis.ico"; Tasks: desktopicon
Name: "{userdesktop}\Maavis - user login"; Filename: "{pf}\Mozilla Firefox\firefox.exe"; parameters: "-P Maavis -no-remote -login"; Comment: "Run Maavis with user login";  IconFilename: "{app}\Maavis.ico"; Tasks: desktopicon
Name: "{userdesktop}\Maavis Media"; Filename: "explorer"; parameters: "{userdocs}\MaavisMedia\Users\default"; Comment: "Open Media folder where photos, music and videos are found.";  IconFilename: "{app}\Maavis.ico"; Tasks: desktopiconmedia
Name: "{userdesktop}\Maavis Settings"; Filename: "{pf}\Mozilla Firefox\firefox.exe"; parameters: "-P Maavis -config -no-remote"; Comment: "Change how Maavis looks";  IconFilename: "{app}\Maavis.ico"; Tasks: desktopiconcfg
;Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\Launch Maavis"; Filename: "{app}\Maavis.exe"; WorkingDir: "{userdocs}"; Comment: "Automatically narrates PowerPoint presentations"; Tasks: quicklaunchicon

; config
Name: "{app}\Edit Styles"; Filename: "explorer"; Parameters:"{app}\extension\chrome\skin"; Comment: "Edit Styles"
Name: "{app}\Edit Screens"; Filename: "explorer"; Parameters:"{app}\extension\chrome\content\Maavis"; Comment: "Edit Screens"

; create startup item so autoruns
Name: "{userstartup}\Maavis"; Filename: "{pf}\Mozilla Firefox\firefox.exe"; parameters: "-P Maavis -no-remote"; Comment: "Run Maavis"; IconFilename: "{app}\Maavis.ico";  Tasks: turnkey


[Run]
;Filename: "{app}\ReadMe.htm"; Description: "View Readme.htm"; Flags: shellexec skipifdoesntexist postinstall skipifsilent
Filename: "{app}\installers\{code:FirefoxInstaller}"; Description: "Install Firefox Web browser"; Tasks: "firefox"
Filename: "{pf}\Mozilla Firefox\firefox.exe"; Parameters: "-CreateProfile default";
Filename: "{pf}\Mozilla Firefox\firefox.exe"; Parameters: "-CreateProfile Maavis"; AfterInstall: InstallMaavisFFExtension;
Filename: "{%COMSPEC}"; parameters: "/C xcopy /e/y/q ""{app}\media"" ""{userdocs}\MaavisMedia\"""; Description: "Install the example Maavis setup and media files to the documents folder."; Flags: postinstall skipifsilent
Filename: "{app}\installers\{code:SkypeInstaller}";  Description: "Install Skype - required for Video Calls."; Flags: postinstall runascurrentuser unchecked
Filename: "{pf}\Mozilla Firefox\firefox.exe"; parameters: "-P ""Maavis"" -no-remote"; Description: "Run Maavis now."; Flags: postinstall skipifsilent


[UninstallDelete]
Type: files; Name: "{app}\Maavis.url"
Type: files; Name: "{app}\ACT.url"
Type: files; Name: "{app}\FullMeasure.url"
Type: files; Name: "{app}\MozillaEurope.url"


[Registry]
; Required so VLC plugin can find it's plugins folder - warning is fragile
Root: HKLM; Subkey: "SOFTWARE\VideoLAN\VLC"; ValueType: string; ValueName: InstallDir;  ValueData: "{pf}\Maavis\extension\plugins"; Flags: createvalueifdoesntexist;

[code]
procedure InstallMaavisFFExtension();
var
  ProfileRoot: String;
  ProfileDir: String;
  FFExtensionsDir: String;
  MaavisExtensionDir: String;
  FindRec: TFindRec;
begin
  { Return the Maavis Mozilla Firefox profile dir }
  ProfileRoot := ExpandConstant('{userappdata}\Mozilla\Firefox\Profiles\');
  { MsgBox('Installing Maavis', mbInformation, MB_OK); }
  ProfileDir := '';
  if FindFirst(ProfileRoot + '*.Maavis', FindRec) then begin
    try
      repeat
        {if FindRec.Attributes and FILE_ATTRIBUTE_DIRECTORY = 1 then}
        begin
          ProfileDir := ProfileRoot + FindRec.Name;
          break;
        end
      until not FindNext(FindRec);
    finally
      FindClose(FindRec);
    end;
  end;
  FFExtensionsDir := ProfileDir + '\extensions';
  CreateDir(FFExtensionsDir);
  MaavisExtensionDir := ExpandConstant('{pf}\Maavis\extension\');
  SaveStringToFile(FFExtensionsDir + '\maavis@fullmeasure.co.uk', MaavisExtensionDir + #13#10, False);
end;

// Constants
function FirefoxInstaller(Param: String): String;
begin
  Result := 'Firefox Setup 3.5.9.exe';
end;

function SkypeInstaller(Param: String): String;
begin
  Result := 'SkypeSetup.exe';
end;

// shame we can't use this as {code:} errors in first section
//function MaavisVersion(Param: String): String;
//begin
  //Result := '0.1.4';
//end;


