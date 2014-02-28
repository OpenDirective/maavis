[Setup]
AppName=MaavisPortable
AppVerName=MaavisPortable 0.2.5
OutputBaseFilename=MaavisPortable-0.2.5
AppVersion=0.2.5
VersioninfoVersion=0.2.5
; Developed by Steve Lee of Full Measure.
AppPublisher=Full Measure for the University Of Sheffield
AppCopyright=Copyright (C) 2008-14 The University Of Sheffield
AppPublisherURL=http://fullmeasure.co.uk
AppSupportURL=http://maavis.fullmeasure.co.uk
DefaultDirName={userdesktop}\MaavisPortable
;AppendDefaultDirName=no
PrivilegesRequired=admin
SetupIconFile=Maavis.ico
Uninstallable=no
;DisableWelcomePage=yes
ChangesEnvironment=yes

;Note the Firefox and Skype installer filenames are defined at the end of this file
;Firefox portable must be placed in the installerPart

; max compression - slower, not recommended over around 100 MB
;SolidCompression=true

[Languages]
Name: "en"; MessagesFile: "compiler:Default.isl"
Name: "es"; MessagesFile: "compiler:Languages\Spanish.isl"
Name: "de"; MessagesFile: "compiler:Languages\German.isl"
Name: "el"; MessagesFile: "compiler:Languages\Greek.isl"


[Messages]
WelcomeLabel1=Notes for installing [name/ver].
WelcomeLabel2=MaavisPortable is designed to run from a hard disk or memory stick without being 'installed' onto a specific computer. Thus this 'installer' simply copies Maavis files ready to be run.%n%nIMPORTANT - in order to use the optional video call facility you need to choose the option to install SkypePortable.%n%nAn example setup with media files will be installed ready for you to customise.
WizardInstalling=Copying
InstallingLabel=Please wait while Setup copies [name] to your computer.
FinishedLabelNoIcons=Setup has copied [name] and the example MaavisMedia.
ClickFinish=To use Maavis video calls please check the box and click Finish. Otherwise click Finish to exit.

[Tasks]
;Name: "turnkey"; Description: "Run Maavis &automatically whenever this user logs on to Windows"; Flags: unchecked

[Files]
; we might expect *.* to copy *this* file too but looks Inno like writes to temp file 1st so not a problem
Source: "MaavisPortable\*"; DestDir: "{app}\MaavisPortable"; Excludes: "\App\FirefoxPortable\Data\*"; Flags: recursesubdirs ignoreversion
Source: "..\extension\*"; DestDir: "{app}\MaavisPortable\App\extension"; Excludes: "\platform"; Flags: recursesubdirs ignoreversion;
Source: "Credits and attribution.txt"; DestDir: "{app}\MaavisPortable\Other\Src"; Flags: ignoreversion
Source: "Maavis.ico"; DestDir: "{app}\MaavisPortable\Other\Src"; Flags: ignoreversion
Source: "MaavisPortable\help.html"; DestDir: "{app}"; Flags: ignoreversion;  AfterInstall: SetBrowserLanguage;

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

[Registry]
; set MAAVIS_HOME & MAVIS_MEDIA env vars for GPII to find them - see ticket #216
Root: HKLM; Subkey: "SYSTEM\CurrentControlSet\Control\Session Manager\Environment"; ValueType:string; ValueName:"MAAVIS_HOME"; ValueData:"{app}"; Flags: preservestringtype
Root: HKLM; Subkey: "SYSTEM\CurrentControlSet\Control\Session Manager\Environment"; ValueType:string; ValueName:"MAAVIS_MEDIA"; ValueData:"{app}\MaavisMedia"; Flags: preservestringtype
 
[INI]

[Icons]

[Run]
Filename: "{app}\MaavisPortable\Other\installers\{code:SkypeInstaller}";  Description: "Install SkypePortable for video call feature.  IMPORTANT - you must install it in a folder next to MaavisPortable - if you installed Maavis to E:\MaavisPortable then ensure you select E:\SkypePortable.  This will download Skype files so you need to be connnected to the internet. You need to sign in to Skype and test it to ensure it is working before using it with Maavis"; Flags: postinstall runascurrentuser unchecked

[code]
function SkypeInstaller(Param: String): String;
begin
  Result := 'SkypePortable_5.10.0.114_online.paf.exe';
end;

procedure SetBrowserLanguage();
var
 PrefsFile: String;
 LangPref: String;
begin
  PrefsFile := ExpandConstant('{app}\MaavisPortable\App\extension\defaults\preferences\prefs.js');
  LangPref := ExpandConstant('pref("general.useragent.locale","{language}");');
  SaveStringToFile(PrefsFile, #13#10#13#10 + '//Set browser language - added by installer' + #13#10 + LangPref, True);
end;

// shame we can't use this as {code:} errors in first section
//function MaavisVersion(Param: String): String;
//begin
  //Result := '0.1.4';
//end;


