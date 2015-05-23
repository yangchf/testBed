@ECHO OFF

REM USE RAMDISK WHEN CREATING PROFILE
REM COPY PROF ROOT TO PERMANENT
REM LEAVE PERMANENT TO USE FOR PERSISTENT SCRIPT CACHE
REM [workingdirroot e.g. C:\ironman\work]/work_pool/FF35/agt_0 (this is the ramdisk)
REM [storagedirroot e.g. C:\ironman\storage]/FF35/agt_0 (this is permanent)
REM need commandline arg to specify storage root
REM GOZ_AGENT_NUM means the max concurrent running profiles we need.

IF [%1]==[-help] goto usage
IF [%1]==[help] goto usage
IF [%1]==[/?] goto usage
IF [%1]==[?] goto usage

IF NOT [%1]==[] SET GOZ_AGENT_NUM=%1
IF NOT [%2]==[] SET GOZ_WORK_ROOT=%2
IF NOT [%3]==[] SET GOZ_STORAGE_ROOT=%3


REM default provisioning settings for ironman service mode
IF NOT DEFINED GOZ_AGENT_NUM set GOZ_AGENT_NUM=700
IF NOT DEFINED GOZ_WORK_ROOT set GOZ_WORK_ROOT=%cd%\..\work
IF NOT DEFINED GOZ_STORAGE_ROOT set GOZ_STORAGE_ROOT=%cd%\..\storage
GOTO START

:START
REM const settings
SET GOZ_INSTALL_ROOT=%cd%\..
SET GOZ_BINARY=gozilla.exe
SET GOZ_AGENT_LABEL=FF35
SET GOZ_BASE_PORT=8801
SET DELAY_SECONDS=40

ECHO GOZ_WORK_ROOT = %GOZ_WORK_ROOT%
ECHO GOZ_STORAGE_ROOT = %GOZ_STORAGE_ROOT%
ECHO GOZ_AGENT_NUM = %GOZ_AGENT_NUM%

IF EXIST %GOZ_WORK_ROOT%\work_pool\%GOZ_AGENT_LABEL% RMDIR /S /Q %GOZ_WORK_ROOT%\work_pool\%GOZ_AGENT_LABEL%
IF EXIST %GOZ_STORAGE_ROOT%\%GOZ_AGENT_LABEL% RMDIR /S /Q %GOZ_STORAGE_ROOT%\%GOZ_AGENT_LABEL%


mkdir %GOZ_WORK_ROOT%\work_pool\%GOZ_AGENT_LABEL%
mkdir %GOZ_STORAGE_ROOT%\%GOZ_AGENT_LABEL%

REM IMPORTANT, other wise, it fails to create default profile.
IF [%GOZ_WORK_ROOT%]==[.] set GOZ_WORK_ROOT=%CD%

set /a MAX_PROFILE_NUM=%GOZ_AGENT_NUM%-1

REM open delay expansion
setlocal enabledelayedexpansion

FOR /L %%A IN (0,1,%MAX_PROFILE_NUM%) DO (	

  REM set in loop
  SET /a GOZ_AGENT_PORT=%GOZ_BASE_PORT%+%%A
  ECHO GOZ_AGENT_PORT = !GOZ_AGENT_PORT!

	REM try this new method.  Create a profile using only a directory and use awaitfile to wait for the process to release the profile lock
	mkdir %GOZ_WORK_ROOT%\work_pool\%GOZ_AGENT_LABEL%\agt_%%A
	%GOZ_INSTALL_ROOT%\%GOZ_BINARY% -no-remote -profile %GOZ_WORK_ROOT%\work_pool\%GOZ_AGENT_LABEL%\agt_%%A -tsport 8700 -bootstrap about:blank
	awaitfile.exe %GOZ_WORK_ROOT%\work_pool\%GOZ_AGENT_LABEL%\agt_%%A\parent.lock 20000
	
	@ping -n 2 127.0.0.1 > pingtime.log
	
	REM copy the work_pool dirs the storage_root as templates
	XCOPY /E /Y /I %GOZ_WORK_ROOT%\work_pool\%GOZ_AGENT_LABEL%\agt_%%A %GOZ_STORAGE_ROOT%\%GOZ_AGENT_LABEL%\agt_%%A && @ping -n 2 127.0.0.1 > pingtime.log && start %GOZ_INSTALL_ROOT%\%GOZ_BINARY% -no-remote -profile %GOZ_WORK_ROOT%\work_pool\%GOZ_AGENT_LABEL%\agt_%%A -tsport !GOZ_AGENT_PORT! www.msn.com -storage %GOZ_STORAGE_ROOT%\%GOZ_AGENT_LABEL%\agt_%%A

  

  REM start gozilla background
  

  @ping -n %DELAY_SECONDS% 127.0.0.1 > pingtime.log

)


GOTO END

:usage
ECHO ================================================================
ECHO create profiles for gozilla and start 
ECHO usage:   gozilla-batch.cmd GOZ_AGENT_NUM GOZ_WORK_ROOT GOZ_STORAGE_ROOT
ECHO sample:  gozilla-batch.cmd 10 ..\work ..\storage
ECHO default: gozilla-batch.cmd 10 d:\work d:\storage
ECHO ================================================================

@ECHO ON

:END