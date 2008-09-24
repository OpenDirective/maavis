[Setup]
AppName=Maavis
AppVerName=Maavis 0.1.0
OutputBaseFilename=Maavis-0.1.0
AppVersion=0.1.0
VersioninfoVersion=0.1.0
AppPublisher=The University Of Sheffield
; Developed by Steve Lee of Full Measure.
AppCopyright=Copyright (C) 2008 The University Of Sheffield
AppPublisherURL=www.actprogramme.org.uk
AppSupportURL=www.maavis.co.uk
AppUpdatesURL=www.maavis.co.uk
DefaultGroupName=Maavis
;LicenseFile=GPL.txt
DefaultDirName={pf}\Maavis
PrivilegesRequired=admin
SetupIconFile=Maavis.ico

;default compression
;Compression=lzma/max
;SolidCompression=false
;InternalCompressLevel=max

; max compression - slower
;Compression=lzma/ultra
;SolidCompression=true
;InternalCompressLevel=ultra


[Tasks]
Name: "turnkey"; Description: "Run Maavis &automatically on login"; GroupDescription: "Additional icons:";
Name: "desktopicon"; Description: "Put an icon on the desktop for &Maavis"; GroupDescription: "Additional icons:";
Name: "desktopiconmedia"; Description: "Put an icon on the desktop to &change Maavis photos, music and videos"; GroupDescription: "Additional icons:";
Name: "desktopiconcfg"; Description: "Put an icon on the desktop to change how Maavis &looks"; GroupDescription: "Additional icons:";
;Name: quicklaunchicon; Description: "Create a &Quick Launch icon"; GroupDescription: "Additional icons:"; MinVersion: 0,5.01; Flags: unchecked


[Files]
; we might expect *.* to copy *this* file too but looks Inno like writes to temp file 1st so not a problem
Source: "..\extension\*"; DestDir: "{app}\extension"; Flags: recursesubdirs ignoreversion
Source: "GPL.txt"; DestDir: "{app}"; Flags: ignoreversion
Source: "Credits and attribution.txt"; DestDir: "{app}"; Flags: ignoreversion
Source: "Maavis.ico"; DestDir: "{app}"; Flags: ignoreversion

; copy the non debug version of prefs.js
Source: "..\extension\defaults\preferences\prefs_deploy.js"; DestDir: "{app}\extension\defaults\preferences"; Flags: ignoreversion

; Installer
Source: ".\*"; DestDir: "{app}\installer"; Excludes: "Output"; Flags: ignoreversion

; Media
;Source: "{userdocs}\Maavis Media"; DestDir: "{userdocs}\Maavis Media"; Flags: recursesubdirs ignoreversion


[INI]
Filename: "{app}\Maavis.url"; Section: "InternetShortcut"; Key: "URL"; String: "www.maavis.co.uk"
Filename: "{app}\ACT.url"; Section: "InternetShortcut"; Key: "URL"; String: "www.actprogramme.org.uk"
Filename: "{app}\FullMeasure.url"; Section: "InternetShortcut"; Key: "URL"; String: "fullmeasure.co.uk"
Filename: "{app}\MozillaEurope.url"; Section: "InternetShortcut"; Key: "URL"; String: "www.mozilla-europe.org"

[Icons]
; programs in start menu
Name: "{group}\Maavis"; Filename: "{pf}\Mozilla Firefox\firefox.exe"; parameters: "-P ""Maavis"""; Comment: "Run Maavis."; IconFilename: "{app}\Maavis.ico"
Name: "{group}\Maavis Media"; Filename: "explorer"; parameters: "{userdocs}\Maavis Media\Users\default"; Comment: "Open Media folder where photos, music and videos are found."; IconFilename: "{app}\Maavis.ico"
Name: "{group}\Maavis Settings"; Filename: "{pf}\Mozilla Firefox\firefox.exe"; parameters: "-P ""Maavis"" -config"; Comment: "Change how Maavis looks and behaves"; IconFilename: "{app}\Maavis.ico"
Name: "{group}\Speech Settings"; Filename: "control"; parameters: "speech"; Comment: "Change speech settings"
; web links in start menu
Name: "{group}\Maavis website"; Filename: "{app}\Maavis.url"; Comment: "Visit the Maavis website"
Name: "{group}\ACT website"; Filename: "{app}\ACT.url"; Comment: "Visit the ACT website"
Name: "{group}\Mozilla Europe website"; Filename: "{app}\MozillaEurope.url"; Comment: "Visit the Mozilla Europe website"
Name: "{group}\Full Measure website"; Filename: "{app}\FullMeasure.url"; Comment: "Visit the Full Measure website"

; desktop - optional
Name: "{userdesktop}\Maavis"; Filename: "{pf}\Mozilla Firefox\firefox.exe"; parameters: "-P ""Maavis"""; Comment: "Run Maavis";  IconFilename: "{app}\Maavis.ico"; Tasks: desktopicon
Name: "{userdesktop}\Maavis Media"; Filename: "explorer"; parameters: "{userdocs}\Maavis Media\Users\default"; Comment: "Open Media folder where photos, music and videos are found.";  IconFilename: "{app}\Maavis.ico"; Tasks: desktopiconmedia
Name: "{userdesktop}\Maavis Settings"; Filename: "{pf}\Mozilla Firefox\firefox.exe"; parameters: "-P ""Maavis"" -config"; Comment: "Change how Maavis looks";  IconFilename: "{app}\Maavis.ico"; Tasks: desktopiconcfg
;Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\Launch Maavis"; Filename: "{app}\Maavis.exe"; WorkingDir: "{userdocs}"; Comment: "Automatically narrates PowerPoint presentations"; Tasks: quicklaunchicon

; config
Name: "{app}\Edit Styles"; Filename: "explorer"; Parameters:"{app}\extension\chrome\skin"; Comment: "Edit Styles"
Name: "{app}\Edit Screens"; Filename: "explorer"; Parameters:"{app}\extension\chrome\content\Maavis"; Comment: "Edit Screens"

; create startup item so autoruns
Name: "{commonstartup}\Maavis"; Filename: "{pf}\Mozilla Firefox\firefox.exe"; parameters: "-P ""Maavis"""; Comment: "Run Maavis"; IconFilename: "{app}\Maavis.ico";  Tasks: turnkey


[Run]
;Filename: "{app}\ReadMe.htm"; Description: "View Readme.htm"; Flags: shellexec skipifdoesntexist postinstall skipifsilent
Filename: "{app}\installer\Firefox Setup 3.0.1.exe"; Description: "Install Firefox 3";
Filename: "{pf}\Mozilla Firefox\firefox.exe"; Parameters: "-CreateProfile default";
Filename: "{pf}\Mozilla Firefox\firefox.exe"; Parameters: "-CreateProfile Maavis"; AfterInstall: InstallMaavisFFExtension;
Filename: "{app}\installer\vlc-0.9.2-win32.exe";  Description: "Install VLC";

Filename: "{app}\installer\SkypeSetup.exe";  Description: "Install Skype (required for Video Calls)"; Flags: postinstall
Filename: "{pf}\Mozilla Firefox\firefox.exe"; parameters: "-P ""Maavis"""; Description: "Run Maavis now"; Flags: postinstall skipifsilent


[UninstallDelete]
Type: files; Name: "{app}\Maavis.url"
Type: files; Name: "{app}\ACT.url"
Type: files; Name: "{app}\FullMeasure.url"
Type: files; Name: "{app}\MozillaEurope.url"


[Registry]
;

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
  MaavisExtensionDir := ExpandConstant('{pf}\Maavis\extension');
  SaveStringToFile(FFExtensionsDir + '\maavis@fullmeasure.co.uk', MaavisExtensionDir + #13#10, False);
end;

