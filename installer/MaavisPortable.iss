[Setup]
AppName=MaavisPortable
AppVerName=MaavisPortable 0.2.0
OutputBaseFilename=MaavisPortable-0.2.0
AppVersion=0.2.0
VersioninfoVersion=0.2.0
; Developed by Steve Lee of Full Measure.
AppPublisher=Full Measure for the University Of Sheffield
AppCopyright=Copyright (C) 2008,2010 The University Of Sheffield
AppPublisherURL=http://fullmeasure.co.uk
AppSupportURL=http://maavis.fullmeasure.co.uk
;LicenseFile=GPL.txt
DefaultDirName={userdesktop}\MaavisPortable
;AppendDefaultDirName=no
PrivilegesRequired=admin
SetupIconFile=Maavis.ico
Uninstallable=no
;DisableWelcomePage=yes

;Note the Firefox and Skype installer filenames are defined at the end of this file

; max compression - slower, not recommended over around 100 MB
;SolidCompression=true

[Messages]
WelcomeLabel1=Notes for installing [name/ver].
WelcomeLabel2=The portable version of Maavis is designed to run from a memory stick and can be run without installation onto a specific computer. Thus this 'installer' simply copies Maavis files ready to be run.%n%nIMPORTANT - in order to use the optional video call facility you need to install SkypePortable to the memory stick. You can choose this option later on%n%nAn example setup with media files will be installed ready for you to customise.
ClickFinish=Click Finish to exit Setup after unchecking any of the following that you do not want to happen.

[Tasks]
;Name: "turnkey"; Description: "Run Maavis &automatically whenever this user logs on to Windows"; Flags: unchecked

[Files]
; we might expect *.* to copy *this* file too but looks Inno like writes to temp file 1st so not a problem
Source: "MaavisPortable\*"; DestDir: "{app}\MaavisPortable"; Flags: recursesubdirs ignoreversion
Source: "3rdParty\FirefoxPortable\*"; DestDir: "{app}\MaavisPortable\App\FirefoxPortable"; Excludes: "\Data\*"; Flags: recursesubdirs ignoreversion
Source: "..\extension\*"; DestDir: "{app}\MaavisPortable\App\extension"; Excludes: "\platform"; Flags: recursesubdirs ignoreversion
Source: "Credits and attribution.txt"; DestDir: "{app}\MaavisPortable\Other\Src"; Flags: ignoreversion
Source: "Maavis.ico"; DestDir: "{app}\MaavisPortable\Other\Src"; Flags: ignoreversion
Source: "MaavisPortable\help.html"; DestDir: "{app}"; Flags: ignoreversion

; MaavisSkypeServer
;Source: "..\extension\platform\dist\*"; DestDir: "{app}\App\platform\dist\extension"; Flags: ignoreversion
Source: "..\extension\platform\dist\*"; DestDir: "{app}\MaavisPortable\App\extension\platform\dist"; Flags: recursesubdirs ignoreversion

Source: "*.cmd"; DestDir: "{app}"; Excludes: "build.cmd"; Flags: ignoreversion

; copy the non debug version of prefs.js
;Source: "..\extension\defaults\preferences\prefs_deploy.js"; DestDir: "{app}\extension\defaults\preferences"; Flags: ignoreversion

; Installers
Source: "3rdParty\Skype*"; DestDir: "{app}\MaavisPortable\Other\installers"; Flags: ignoreversion

; Media
;Source: "..\media\*"; DestDir: "{userdocs}\MaavisMedia"; Flags: recursesubdirs ignoreversion; Tasks: "media"
Source: "..\media\*"; DestDir: "{app}\MaavisMedia"; Excludes: "Thumbs.db"; Flags: recursesubdirs ignoreversion;


[INI]

[Icons]

[Run]
Filename: "{app}\MaavisPortable\Other\installers\{code:SkypeInstaller}";  Description: "Install SkypePortable - required for the optional video call feature.  IMPORTANT - you must install it onto the memory stick next to MaavisPortable - if you installed Maavis to E:\MaavisPortable then ensure you select E:\PortableSkype.  This will download Skype files so you need to be connnected to the internet. It is recommended that you sign in to skype and test it to ensure it is working before using it with Maavis"; Flags: postinstall runascurrentuser unchecked

[code]
function SkypeInstaller(Param: String): String;
begin
  Result := 'SkypePortable_4.2.0.187_online.paf.exe';
end;

// shame we can't use this as {code:} errors in first section
//function MaavisVersion(Param: String): String;
//begin
  //Result := '0.1.4';
//end;


