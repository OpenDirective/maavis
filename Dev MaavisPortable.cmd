@echo off
rem Runs Maavis portable in development envionment not the final runtime layout as built by MaavisPortable.iss
rem also uses the source copy of the default media set - so edit with care
rem You will need to install FirefoxPortable to MaavisPortable\App

set MaavisExtension=%CD%\extension
start "Maavis" /b installer\MaavisPortable\MaavisPortable.exe -user ethel -jsconsole -nokiosk -quickstart -mediafolder "%CD%\media"

