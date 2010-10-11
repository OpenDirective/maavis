@echo off
rem Use this to launch MaavisPortable

set MaavisExtension=%CD%\MaavisPortable\App\extension
start "Maavis" /b MaavisPortable\MaavisPortable.exe -mediafolder "%CD%\MaavisMedia"
