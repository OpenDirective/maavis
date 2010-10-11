@echo off
rem Use this to launch MaavisPortable settings

set MaavisExtension=%CD%\MaavisPortable\App\extension
start "Maavis" /b MaavisPortable\MaavisPortable.exe -config -mediafolder "%CD%\MaavisMedia"

