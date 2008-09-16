[Setup]
AppName=Maavis
AppVerName=Maavis 0.1.0
OutputBaseFilename=Maavis-0.1.0
AppVersion=0.1.0
AppPublisher=Fullmeasure
AppPublisherURL=fullmeasure.co.uk
AppSupportURL=fullmeasure.co.uk
AppUpdatesURL=fullmeasure.co.uk
DefaultGroupName=Maavis
;LicenseFile=GPL.txt
DefaultDirName={pf}\Maavis

;default compression
;Compression=lzma/max
;SolidCompression=false
;InternalCompressLevel=max

; max compression - slower
;Compression=lzma/ultra
;SolidCompression=true
;InternalCompressLevel=ultra

[Tasks]
Name: "desktopicon"; Description: "Create a &desktop icon"; GroupDescription: "Additional icons:";
;Name: quicklaunchicon; Description: "Create a &Quick Launch icon"; GroupDescription: "Additional icons:"; MinVersion: 0,5.01; Flags: unchecked

[Files]
; using *.* should copy *this* file too but looks Inno like is clever enough not to include it in the Output folder
Source: "..\extension\*"; DestDir: "{app}\extension"; Flags: recursesubdirs ignoreversion
Source: "\Documents and Settings\Steve\Application Data\Maavis\*"; DestDir: "{%APPDATA}\Maavis"; Flags: recursesubdirs ignoreversion
;Source: "ReadMe.htm"; DestDir: "{app}"; Flags: ignoreversion
Source: "GPL.txt"; DestDir: "{app}"; Flags: ignoreversion
Source: "maavis@fullmeasure.co.uk"; DestDir: "{app}"; Flags: ignoreversion
Source: "Maavis.ico"; DestDir: "{app}"; Flags: ignoreversion
;Source: "ChangeLog.txt"; DestDir: "{app}"; Flags: ignoreversion
Source: "Firefox Setup 3.0.1.exe"; DestDir: "{app}\installers"; Flags: ignoreversion
Source: "SkypeSetup.exe";  DestDir: "{app}\installers"; Flags: ignoreversion

[INI]
Filename: "{app}\Maavis.url"; Section: "InternetShortcut"; Key: "URL"; String: "mavis.actprogramme.org.uk"
Filename: "{app}\ACT.url"; Section: "InternetShortcut"; Key: "URL"; String: "actprogramme.org.uk"

[Icons]
Name: "{group}\Maavis"; Filename: "C:\Program Files\Mozilla Firefox\firefox.exe"; parameters: "-P ""Maavis"""; Comment: "Run Maavis"; IconFilename: "{app}\Maavis.ico"
Name: "{userdesktop}\Maavis"; Filename: "C:\Program Files\Mozilla Firefox\firefox.exe"; parameters: "-P ""Maavis"""; Comment: "Run Maavis";  IconFilename: "{app}\Maavis.ico"; Tasks: desktopicon
;Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\Launch Maavis"; Filename: "{app}\Maavis.exe"; WorkingDir: "{userdocs}"; Comment: "Automatically narrates PowerPoint presentations"; Tasks: quicklaunchicon
;Name: "{group}\Maavis Settings"; Filename: "{app}\Maavis.exe"; Parameters: "--settings"; WorkingDir: "{app}"; Comment: "Change Maavis settings"
;Name: "{group}\Maavis ReadMe"; Filename: "{app}\ReadMe.htm"; Comment: "View the Maavis readme"
Name: "{group}\Maavis on the Web"; Filename: "{app}\Maavis.url"; Comment: "Visit the Maavis website"
Name: "{group}\ACT on the Web"; Filename: "{app}\ACT.url"; Comment: "Visit the ACT website"

[Run]
;Filename: "{app}\ReadMe.htm"; Description: "View Readme.htm"; Flags: shellexec skipifdoesntexist postinstall skipifsilent
Filename: "{app}\installers\Firefox Setup 3.0.1.exe"; Description: "Install Firefox (required)"; Flags: postinstall
Filename: "{app}\installers\SkypeSetup.exe";  Description: "Install Skype (optional)"; Flags: postinstall
Filename: "C:\Program Files\Mozilla Firefox\firefox.exe"; Parameters: "-CreateProfile Maavis"
;Filename: "{app}\Maavis.exe"; Description: "Launch Maavis"; Flags: shellexec postinstall skipifsilent

[UninstallDelete]
Type: files; Name: "{app}\Maavis.url"
Type: files; Name: "{app}\ACT.url"

[Registry]
;
