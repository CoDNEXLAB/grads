#!/bin/csh -f
#DESCRIPTION: THIS SCRIPT KICKS THE CFS MODEL
#from the NCEP NOMADS server	
#CREATED:  01-15-2015  GENSINI									
#LAST EDIT: 11-15-2016 GENSINI
#####################################################
#PASS THE VALID RUN HOUR
set ModRunTime = $1
#LOCATION OF RUNNER SCRIPT
set Runner = "/home/scripts/grads/runners/cfs_runner.csh"
#Launch downloader script
csh /home/scripts/grads/kickers/cfsdownloader.csh $ModRunTime &
#DATE VARIABLE formatted YYYYMMDD
set dtstr = `date -u +%Y%m%d`
#STRING VARIABLE FORMATTED YYMMDD
set filstr = `date -u +%y%m%d`
sleep 10
set DIR = /home/data/models/cfs
# I don't think these belong here, or have any use... delete these lines?
#DATE VARIABLE formatted YYYYMMDD
set dtstr = `date -u +%Y%m%d`
#STRING VARIABLE FORMATTED YYMMDD
set filstr = `date -u +%y%m%d`
#MANUAL OVERRIDE OF DATE AND TIME STRING
#set dtstr = "20160114" 
#set filstr = "160114"
# Get dir name (in place of runtime):
if ($ModRunTime == 18) then
	set InitDate = `date -d "-1 day" +"%b %d %Y"`
	set dateForDir = `date -u --date="yesterday" +%Y%m%d`${ModRunTime}
else
	set InitDate = `date +"%b %d %Y"`
	set dateForDir = `date -u +%Y%m%d`${ModRunTime}
endif
set InitDate = `date -d "${InitDate} + ${ModRunTime} hours"  +%Y%m%d%H`
#BEGIN LOOP
foreach FHour (000 006 012 018 024 030 036 042 048 054 060 066 072 078 084 090 096 102 108 114 120 126 132 138 144 150 156 162 168 174 180 186 192 198 204 210 216 222 228 234 240 246 252 258 264 270 276 282 288 294 300 306 312 318 324 330 336 342 348 354 360 366 372 378 384 390 396 402 408 414 420 426 432 438 444 450 456 462 468 474 480 486 492 498 504 510 516 522 528 534 540 546 552 558 564 570 576 582 588 594 600 606 612 618 624 630 636 642 648 654 660 666 672 678 684 690 696 702 708 714 720 726 732 738 744 750 756 762 768 774 780 786 792 798)
	set valid = `awk '{if (NR==2) print}' /home/apache/climate/data/forecast/text/cfsstatus.txt`
	set count = 0
	while (($valid < $FHour) && ($count < 65))
		sleep 15
		@ count = $count + 1	
		set valid = `awk '{if (NR==2) print}' /home/apache/climate/data/forecast/text/cfsstatus.txt`
	end
	#process
	if ($FHour == 000) then
		echo `date` ": ${ModRunTime}Z CFS Starting" >> /home/apache/climate/data/forecast/text/cfstimes.txt
		csh $Runner $dateForDir $ModRunTime CFS $FHour
		
	else if ($FHour == 798) then
		csh $Runner $dateForDir $ModRunTime CFS $FHour
		echo `date` ": ${ModRunTime}Z CFS Finished" >> /home/apache/climate/data/forecast/text/cfstimes.txt
	else
		csh $Runner $dateForDir $ModRunTime CFS $FHour
	endif
	php /home/scripts/models/blister.php CFS $dateForDir $FHour
end
wait
