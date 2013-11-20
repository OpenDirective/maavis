@echo off
echo Don't forget to install FirefoxPortable and the flash player
pause

set InnoCC="C:\Program Files (x86)\Inno Setup 5\iscc.exe"

if (%1)==(noplatform) goto noplatform
rem Clean up first to force complete rebuild - optional
cd ..\extension\platform
del /q *.pyc 2> nul:
rd /s/q build 2> nul:
rd /s/q dist 2> nul: 

c:\python25\python setup.py py2exe
if errorlevel 1 goto error 

cd ..\..\installer
:noplatform

rem clean up firefox portable data
rd /s/q MaavisPortable\App\FirefoxPortable\Data
mkdir MaavisPortable\App\FirefoxPortable\Data

rem "C:\Program Files\Inno Setup 5\iscc" "Maavis.iss"
rem if errorlevel 1 goto error 
%InnoCC% "MaavisPortable.iss"
if errorlevel 1 goto error 
goto OK

:error
echo.
echo Whoops, an error occured
echo.
 	
:ok 