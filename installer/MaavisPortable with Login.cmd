@echo off
rem Use this to launch MaavisPortable with login

set MaavisExtension=%CD%\MaavisPortable\App\extension
start "Maavis" /b MaavisPortable\MaavisPortable.exe -login -mediafolder "%CD%\MaavisMedia"

