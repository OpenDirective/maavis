${SegmentFile}

Var FOO

${SegmentPre}
   ;MessageBox MB_OK|MB_ICONINFORMATION `$(LauncherNoReadOnly)`
!macroend

${SegmentUnload}
   ;MessageBox MB_OK|MB_ICONINFORMATION "Bye"
!macroend


