@echo off
rem Use this to launch MaavisPortable and debug it

set MaavisExtension=%CD%\App\extension
start "Maavis" /b .\MaavisPortable.exe -jsconsole -nokiosk -quickstart -mediafolder "%CD%\..\MaavisMedia"

