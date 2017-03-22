#!/bin/csh -f
#########################################################
#THIS IS THE HOLY GRAIL OF RUNNER SCRIPTS				#		
#########################################################
#PURPOSE: RUN MODELS PROMPTLY!							#
#DESCRIPTION: THIS SCRIPT KICKS OFF MODEL RUNNERS		#
#LAST EDIT:  01/20/2016  GENSINI						#
#########################################################
#CHANGE TO WORKING DIRECTORY
cd /home/scripts/grads/kickers

#FIND CORRECT MODEL TIME
set modtime = $1

#PATH AND NAME OF MODEL RUNNER SCRIPT:
set Runner = "/home/scripts/grads/runners/hrrr15_runner.csh"
if (`date -u +%H` < $modtime) then
	set dtstr = `date -u --date="yesterday" +%y%m%d`
	set dateForDir = `date -u --date="yesterday" +%Y%m%d`${modtime}
else
	set dtstr = `date -u +%y%m%d`
	set dateForDir = `date -u +%Y%m%d`${modtime}
endif
set datadir = "/home/data/models/hrrr15"
###############################################
#BEGIN SNAKE LOOP TO CHECK FOR AVAILABLE TIMES#
###############################################
foreach FHour (000 001 002 003 004 005 006 007 008 009 010 011 012 013 014 015 016 017 018 019 020 021 022 023 024 025 026 027 028 029 030 031 032 033 034 035 036 037 038 039 040 041 042 043 044 045 046 047 048 049 050 051 052 053 054 055 056 057 058 059 060 061 062 063 064 065 066 067 068 069 070 071 072)
	set filename = ${datadir}/${dtstr}${modtime}00.hrrr15
	set filegrids = `/usr/local/bin/wgrib2 ${filename} | tail -n1 | sed 's/ *:.*//'`
	#CHECK TO SEE IF FILE EXISTS AND IT IS GREATER THAN xx SIZE. IF NO NEW, SLEEP FOR 10s
	@ count = 0
	if ($FHour == 000) then
		while (($count < 70) && ($filegrids < 2 ))
			sleep 10
			set filegrids = `/usr/local/bin/wgrib2 ${filename} | tail -n1 | sed 's/ *:.*//'`
			@ count = $count + 1
		end
	else
		while (($count < 50) && ($filegrids < (2 * ${FHour}) ))
			sleep 10
			set filegrids = `/usr/local/bin/wgrib2 ${filename} | tail -n1 | sed 's/ *:.*//'`
			@ count = $count + 1
		end
	endif
	if ($FHour == 059) then
		csh $Runner $dateForDir $modtime HRRR15 $FHour
		#php /home/scripts/models/blister.php HRRR $dateForDir $FHour
		echo `date` ": ${modtime}Z HRRR15 Finished" >> /home/apache/atlas/data/forecast/text/hrrr15times.txt
	else
		if ($FHour == 000) then
			echo `date` ": ${modtime}Z HRRR15 Starting" >> /home/apache/atlas/data/forecast/text/hrrr15times.txt
			csh $Runner $dateForDir $modtime HRRR15 $FHour
			#perl /home/scripts/models/newclearmodeldir.pl $modtime HRRR
		else
			csh $Runner $dateForDir $modtime HRRR15 $FHour
		endif			
		#php /home/scripts/models/blister.php HRRR15 $dateForDir $FHour
	endif
	ssh -p31950 climate /usr/bin/php /home/scripts/models/blister.php HRRR15 $dateForDir $FHour
end	
exit

