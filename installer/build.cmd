@echo off
echo Don't forget to install FirefoxPortable and the flash player
pause


rem Clean up first to force complete rebuild - optional
cd ..\extension\platform
del /q *.pyc 2> nul:
rd /s/q build 2> nul:
rd /s/q dist 2> nul: 

c:\python25\python setup.py py2exe
if errorlevel 1 goto error 

cd ..\..\installer

rem clean up firefox portable data
rd /s/q MaavisPortable\App\FirefoxPortable\Data
mkdir MaavisPortable\App\FirefoxPortable\Data

rem "C:\Program Files\Inno Setup 5\iscc" "Maavis.iss"
rem if errorlevel 1 goto error 
"C:\Program Files\Inno Setup 5\iscc" "MaavisPortable.iss"
if errorlevel 1 goto error 

goto OK

:error
echo.
echo Whoops, an error occured
echo.
 	
:ok 