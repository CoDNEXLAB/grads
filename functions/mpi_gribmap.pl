#!/usr/bin/perl -w
# 2012 Public Domain Wesley Ebisuzaki
#
# alt_gribmap  alternative format for grib2 ctl files
# 6/2013 added ENV{OMP_NUM_THREADS}=1 for wgrib2
use POSIX;
use threads;
use threads::shared;

$program=$0;
$version="0.0.4";
$wgrib2="wgrib2";
$gzip='gzip';
$wgrib2_flags='';
# $index_format = 1;
$ctl='';
$good_npts=0;
$verbose = 0;
$update = 0;
$nthreads = 5;
$ENV{'OMP_NUM_THREADS'}=1;

$undef = -999;
# $undef will not be the same after packed into $index_buffer because
# saved as 32-bit unsigned number and converted back into positive 64-bit number
$undef_vec = unpack("N", pack("N", -999));

# get options
for ($i = 0; $i <= $#ARGV; $i++) {
   $_ = $ARGV[$i];
   if (/^-npts/) { $good_npts = $ARGV[++$i]; }
   if (/^-proc/) { $nthreads = $ARGV[++$i]; }
   if (/^-nthreads/) { $nthreads = $ARGV[++$i]; }
   elsif (/^-i/) { $ctl = $ARGV[++$i]; }
   elsif (/^-v/) { $verbose++; }
   else { $ctl = $ARGV[$i]; }
}

if ($ctl eq "") { die "no ctl file specified\n"; }

&scan_ctl;
&resolve_dset_index;

# print contents of the id table
if ($verbose > 1) {
   for ($i = 0; $i < $nfields; $i++) { print "table: $i  id=$var_id[$i]\n"; }
}

# find number of fields per time step
$size = $nfields * $ntime * 2;
if ($verbose > 1) { print "size=$size\n"; }

# figure out the initial date code
$date0=from_gdate($start_time);
if ($verbose > 1) { print "date0 = $date0 or $start_time\n"; }

# make an array of all the time codes
make_timestamps($ntime, $date0, $inc_time);

if ($verbose > 1) { 
   foreach $time (sort keys(%time_stamp)) { print "time=$time $time_stamp{$time} \n"; }
}

mk_template_list($dset, $inc_time);

$n=$#template_file;
$nfound=0;
$nmissing=0;

make_index();

$total=$ntime*$nfields;
print "$program v$version finished ctl=$ctl records matched=$nfound, not matched=$nmissing ctl_defn=$total\n";

exit 0;


#-----------------------------------------------------------------

sub make_index {

#    my ($index_buffer);
   my ($inv, $last, $j);
   my ($num,$loc,$npts,$date,$id);
   my ($fail_fork);


   # open index file
   open(INDEX, ">", $index) or die "failed to open index file: $index\n";
   binmode(INDEX);
   # initialize index file buffer with -999 (32-bit network order)
   $index_buffer = (pack "N", $undef) x $size;
   $temp_index_buffer = $index_buffer;

#  make pipes for communiation

   for ($count = 1; $count < $nthreads; $count++) {
      pipe($read[$count], $write[$count] );
      binmode($read[$count]);
      binmode($write[$count]);
   }

#  make $nthreads threads/processes
   my (@pids);
   $fail_fork = 0;
   $pid = -1;

   for ($count = 1; $count < $nthreads; $count++) {
      $pid = fork();
      if (not defined($pid)) {
#        if fork fails, set number of procs=1
         print "fork failed, nprocs set to 1\n";
         $nthreads = 1; $fail_fork = 1; last; }
      if ($pid != 0) {
         # parent
         $pids[$count] = $pid;
      }
      else {
         # child
         last;
      }
   }
   if ($pid != 0) { $count = 0 };

#  if fork failed, kill childern procs
   if ($fail_fork == 1 && $pid == 0) { exit 0; }

#  print "process=$count out of $nthreads processes\n";

   if ($update == 1) {
      # update: use index files
      for ($inv = $count; $inv <= $n; $inv += $nthreads) {
         $inv_file = $template_file[$inv] . $wgrib2_inv . '.gz';
         # make inventory file
         if (! -f $inv_file) {
             if (! -f $template_file[$inv]) {
                $file = $template_file[$inv];
                print "missing grib2 file $file\n";
                $template_file[$inv] = '';
                next;
             }
             else {
#               print "making: $inv_file  process=$count\n";
                system "$wgrib2 $wgrib2_flags \"$template_file[$inv]\" | $gzip -c > $inv_file";
             }
         }
         if (-f $inv_file) {
             print "scanning-gz $inv_file (process=$count)\n";
             open(INV, "$gzip -dc $inv_file |") or die "could not $gzip $inv_file\n";
             scan_inv();
         }
      }
   }
   else {
      # scan the grib2 files
      for ($inv = $count; $inv <= $n; $inv += $nthreads) {
         if (! -r $template_file[$inv]) {
            print "missing grib2 file $template_file[$inv] (process=$count)\n";
            next;
         }
         open(INV,"$wgrib2 $wgrib2_flags \"$template_file[$inv]\"  |") or die "unexpect fail $wgrib2 $template_file[$inv]\n";
         print "scanning $template_file[$inv] (process=$count)\n";
         scan_inv();
      }
   }

#  child processes write $index_buffer to parent

   if ($pid == 0) { 
      print { $write[$count] } pack("NNN", $count, $nmissing, $nfound);
#     only write index file if found a match
      if ($nfound != 0) { print { $write[$count] } $index_buffer; }
      exit 0;
   }

#  parent process reads $index_buffer from all child process
#  and merges index_buffer

   print "merge index files\n";
   for ($count = 1; $count < $nthreads; $count++) {
      read  $read[$count], $i, 4;
      $j = unpack("N", $i);
      if ($j != $count) { print "programming error, pipe mismatch\n"; }

      read  $read[$count], $i, 4;
      $j = unpack("N", $i);
      $nmissing += $j;

      read  $read[$count], $i, 4;
      $j = unpack("N", $i);
      $nfound += $j;

      if ($j != 0) {
         $i = read  $read[$count], $temp_index_buffer, 4*$size;
      }

#      print "read pipe $count bytes=$i nfound=$j undef=$undef\n";

      for ($i = 0; $i < $size; $i++) {
         $j = vec($temp_index_buffer, $i, 32);
         if ($j != $undef_vec) { vec($index_buffer, $i, 32) = $j;}
      }
      waitpid($pids[$count], 0);
   }

   # write index file
   print "writing out index\n";
   print INDEX pack("NN", 1, $size);
   print INDEX $index_buffer;
}


# --------------------- start of various routines -----------------------

sub scan_inv {

      my ($num, $loc, $npts, $date, $id, $t, $j);

      while (<INV>) {
         chomp;
         if ($verbose > 2) { print "wgrib2 inv=$_\n"; }
         ($num,$loc,$npts,$date,$id) = split(/:/, $_, 5);
         $npts =~ s/npts=//;
         $npts = $npts + 0;
         $date =~ s/.*=//;
         # convert YYYYMMDDHHMMSS -> YYYYMMDDHHMM
         $date = substr($date,0,12);
         if ($good_npts == 0) { $good_npts = $npts; }

         # get submessage number
         if ($num =~ /\.(\d*)/) { $num = $1; }
         else { $num = 1; }

         if ($verbose > 2) { print "submsg num=$num loc=$loc date=$date id=$id\n"; }
         $t = -1;
         if (($good_npts == $npts) && defined($i = $var_num{$id}) && defined($t = $time_stamp{$date}) ) {
            if ($verbose > 0) { print "MATCH $id $date\n"; }
            $j = 2*($i + $nfields * $t);
            vec($index_buffer, $j, 32) = $loc;
            vec($index_buffer, $j+1, 32) = $num;
            $nfound++;
         }
         else {
            if ($verbose > 0) { print "NO MATCH $id $date\n"; }
            $nmissing++;
         }
      }
      close(INV);
}


sub resolve_dset_index {

#  dset and index could have a caret, resolve relative to ctl file
   if (substr($index,0,1) eq '^' || substr($dset,0,1) eq '^') {
      if ($ctl =~ /\//) {
         $ctldir = $ctl;
         $ctldir =~ s/\/[^\/]+$/\//;
      }
      else {
         $ctldir = '';
      }
      if (substr($index,0,1) eq '^') { $index =~ s/\^/$ctldir/ };
      if (substr($dset,0,1) eq '^') { $dset =~ s/\^/$ctldir/ };
      if ($verbose > 1) {print "ctldir=$ctldir index=$index dset=$dset\n"; }
   }
}

# make a hash of possible time stamps
sub make_timestamps {
   my ($nt, $date0, $inc, $i, $j, $jj);
   my ($year, $month, $day, $hour, $minute, $unit, $n);
   $nt = $_[0];
   $date0 = $_[1];
   $inc = $_[2];
   $time_stamp{$date0} = 0;
   if ($nt == 1) { return; }

   $year = substr($date0,0,4);
   $month = substr($date0,4,2);
   $day = substr($date0,6,2);
   $hour = substr($date0,8,2);
   $minute = substr($date0,10,2);
   $inc =~ /(\d+)([a-zA-Z]+)/ or die "make_timestamps: fatal error bad increment $inc\n";
   $n = $1;
   $unit = $2;
   $unit =~ tr/A-Z/a-z/;

   if ($unit =~ /yr/) {
      for ($i = 1; $i < $nt; $i++) {
         $year += $n;
         $time_stamp{sprintf "%4d%2.2d%2.2d%2.2d%2.2d", $year, $month, $day, $hour, $minute} = $i;
      }
      return;
   }
   if ($unit =~ /mo/) {
      for ($i = 1; $i < $nt; $i++) {
         $month += $n;
         if ($month > 12) { 
             $j = floor(($month-1)/12);
             $year += $j;
             $month = $month - 12*$j;
         }
         $time_stamp{sprintf "%4d%2.2d%2.2d%2.2d%2.2d", $year, $month, $day, $hour, $minute} = $i;
      }
      return;
   }

#  convert to minutes

   if ($unit eq 'hr') { $n *= 60; $unit = 'mn'; }
   elsif ($unit eq 'dy') { $n *= 24*60; $unit = 'mn'; }
   else { die "bad unit $unit\n"; }

   for ($i = 1; $i < $nt; $i++) {
      $minute += $n;
      if ($minute >= 60) {
         $j = floor($minute/60);
         $minute -= 60*$j;
         $hour += $j;
         if ($hour >= 24) {
            $j = floor($hour/24);
            $hour -= 24*$j;
#           $j is number of days to add
            $j += julian($year,$month,$day);
            while ($j > 365 + leap_year($year)) {
                $j -= (365 + leap_year($year));
                $year++;
            }
            $jj = unjulian($j,$year);
            $month = substr($jj,0,2);
            $day = substr($jj,2,2);
         }
      }
      $time_stamp{sprintf "%4d%2.2d%2.2d%2.2d%2.2d", $year, $month, $day, $hour, $minute} = $i;
   }
}

#
# convert from gdate to YYYYMMDDHHMM format
#

sub from_gdate {
   my ($gdate, $min, $hour, $day, $mon, $year);
   $gdate = $_[0];
   $_ = $gdate;
 
   $min = 0;
   $hour = 0;

#  get hour and optional minutes 
   if (/^(\d+)+Z/i) {
      $hour = $1;
      $_ = $';
   }
   elsif (/^(\d+):(\d+)Z/i) {
      $hour = $1;
      $min = $2;
      $_ = $';
   }

#  get day month and year
   /(\d+)([a-zA-Z]{3})(\d+)/ or die "from_gdate fatal error: $gdate\n";
   $day = $1;
   $mon = $2;
   $year = $3;

   if (/jan/i) { $mon=1; }
   elsif (/feb/i) { $mon=2; }
   elsif (/mar/i) { $mon=3; }
   elsif (/apr/i) { $mon=4; }
   elsif (/may/i) { $mon=5; }
   elsif (/jun/i) { $mon=6; }
   elsif (/jul/i) { $mon=7; }
   elsif (/aug/i) { $mon=8; }
   elsif (/sep/i) { $mon=9; }
   elsif (/oct/i) { $mon=10; }
   elsif (/nov/i) { $mon=11; }
   elsif (/dec/i) { $mon=12; }

   return sprintf "%4d%2.2d%2.2d%2.2d%2.2d", $year, $mon, $day, $hour, $min;
}


#
# scan_ctl
#
# this routine scans the ctl file
# and sets the needed variables
#
# time variables
#  $ntime, $start_time, $inc_time
#
# level variables
#  $nlevels               number of levels
#  $level[0..$nlevels-1]  level values
#
# variables
#
#  $var_id[$i]
#  $var_num{$id}
#
#
# $nfields = number of fields (var + levels) per time

sub scan_ctl {

   my ($tmp, $i, $a, $b);

   open(CTL,"<", $ctl) or die "Could not open ctl file: $ctl";
   $dtype = 0;
   $pdef = 0;
   $calendar=366;
   $pascals=0;
   while (<CTL>) {
      chomp;

#     can have more than one option per line

      if (/^options.*\s365_day_calendar/i) { 
         $calendar=365;
         if ($verbose > 1) { print "365 day calendar\n"; }
      }
      if (/^options.*\spascals/i) { 
         $pascals=1;
         if ($verbose > 1) { print "pascals\n"; }
      }

#     scan lines
      if (/^tdef /i) {
         /^tdef *(\d+) linear +(\S+) +(\S+)/i or die "failed scanning tdef:  $_";
         $ntime=$1;
         $start_time=$2;
         $inc_time=$3;
         print "tdef:  nt=$ntime start=$start_time by=$inc_time\n";
      }

      elsif (/^zdef /i) {
         $_=~ s/^zdef +(\d+) +levels//i or die "failed scanning zdef:  $_";

         $nlevels=$1;
         print "zdef: nlevel=$nlevels\n";
         for ($i = 0; $i < $nlevels; $i++) {
#           if empty line, read another
	    if (! / *\S+/) { 
               chomp;
               if (!(defined($_ = <CTL>))) {
                  die "failed scanning zdef:\n";
               }
            }
#           need to read a level
	    / *(\S+)/ or die "failed scanning zdef:\n";
            $a = $1;
            $_ = $';
            $level[$i] = $a+0;
            if ($verbose > 1) { print "level[$i]=$level[$i]\n"; }
         }
      }

      elsif (/^vars /i) {
         /^vars +(\d+)/i or die "failed scanning vars:  $_";
         $nvars = $1;
         $nfields = 0;
         for ($i = 0; $i < $nvars; $i++) {
            if (!(defined($_ = <CTL>))) {
               die "vars: end of control file\n";
            }
            chomp;
            if (/^ *endvars/i) {
               die "vars: not enough variables\n";
            }
            / *(\S+) +(\d+) *\d+ *"([^"]+)"/ or die "vars: problem with $_\n";

            # $name = $1;
            $nlevs = $2;
            $id = $3;
            if ($verbose > 1) { print "vars: $1 $2 $id\n"; }

            if ($nlevs == 0) {
               $var_id[$nfields] = $id;
               $var_num{$id} = $nfields;
               $nfields++;
            }
            else {
               if ($nlevs < 0 || $nlevs > $nlevels) { die "vars: number of levels is too big $nlevs\n"; }
               for ($j = 0; $j < $nlevs; $j++) {
                  $tmp = sprintf($id, $level[$j]);
                  $var_id[$nfields] = $tmp;
                  $var_num{$tmp} = $nfields;
                  $nfields++;
               }
            }
         }
         if (!(defined($_ = <CTL>))) {
            die "vars: end of control file\n";
         }
         /^ *endvars/i or die "vars: expecting endvars\n";
         if ($verbose > 1) { print "number of fields=$nfields\n"; }
      }
      elsif (/^xdef /i) {
         if ($verbose > 1) { print "xdef:  $_\n"; }
      }
      elsif (/^ydef /i) {
         if ($verbose > 1) { print "ydef:  $_\n"; }
      }
      elsif (/^pdef /i) {
         print "pdef:  $_";
         $pdef++;
      }
      elsif (/^dtype grib2/i) {
         print "dtype:  $_\n";
         $dtype++;
      }
      elsif (/^index /i) {
         /^index +(\S.*)/i or die "failed scanning index:  $_";
         $index=$1;
         if ($verbose > 1) { print "index:  $index\n"; }
      }
      elsif (/^dset /i) {
         /^dset +(\S.*)/i or die "failed scanning dset:  $_\n";
         $dset=$1;
         if ($verbose > 1) { print "dset:  $dset\n"; }
      }
      elsif (/^\* wgrib2 inventory flags: (.*)/) {
         $wgrib2_flags=$1;
         print "wgrib2_flags=$wgrib2_flags\n";
      }
      elsif (/^\* wgrib2 inv suffix:\s*(\S*)/) {
         $wgrib2_inv=$1;
         print "wgrib2_inv=$wgrib2_inv\n";
      }
      elsif (/^\* alt_gmp options: update=(\S*)/) {
         $update=$1;
      }
      elsif (/^\* alt_gmp options: nthreads=(\S*)/) {
         $nthreads=$1;
      }
   }
   close(CTL);
}


# make a list of templated files along with valid time range

sub mk_template_list {

   my ($dset, $time, $inctime, $fhr, $i, $tmp, $n);
   my ($y4,$y2,$m2,$d2,$f2,$f3);

   $dset = $_[0];
   $inctime = $_[1];
   print "resolve_dsets dset=$dset inctime=$inctime\n";

   $_ = $dset;
   if (! /%/) {
       $template_file[0] = $dset;
       $template_file_min[0] = 0;
       $template_file_max[0] = $ntime-1;
       print "resolve_dsets: no template\n";
       return;
   }

   print "resolve_dsets template dset=$dset\n";
   $_ = $dset;
   $y4 = /%y4/;
   $y2 = /%y2/;
   $m2 = /%m2/;
   $d2 = /%d2/;
   $h2 = /%h2/;
   $n2 = /%n2/;
   $f2 = /%f2/;
   $f3 = /%f3/;
   if ($f2 || $f3) {
      $inctime =~ s/hr$// or die "%f2 needs dt-units of hr\n";
      $fhr = $inctime + 0;
   }

   $n = 0;
   foreach $time (sort keys(%time_stamp)) { 
      $_ = $dset;
      $i = $time_stamp{$time};

      if ($y4) { $tmp = substr($time,0,4); s/%y4/$tmp/g; }
      if ($y2) { $tmp = substr($time,2,2); s/%y2/$tmp/g; }
      if ($m2) { $tmp = substr($time,4,2); s/%m2/$tmp/g; }
      if ($d2) { $tmp = substr($time,6,2); s/%d2/$tmp/g; }
      if ($h2) { $tmp = substr($time,8,2); s/%h2/$tmp/g; }
      if ($n2) { $tmp = substr($time,10,2); s/%n2/$tmp/g; }
      if ($f2) { 
          $tmp = sprintf "%2.0f", $i * $fhr;
          $tmp =~ s/ /0/g;
          s/%f2/$tmp/g;
      }
      if ($f3) { 
          $tmp = sprintf "%3.0f", $i * $fhr;
          $tmp =~ s/ /0/g;
          s/%f3/$tmp/g;
      }

      if ($n == 0) {
          $template_file[$n] = $_;
          $template_file_min[$n] = 0;
          $template_file_max[$n] = 0;
          $n++;
      }
      else {
          if ($_ eq $template_file[$n-1]) {
              $template_file_max[$n-1]++;
          }
          else {
             $template_file[$n] = $_;
             $template_file_min[$n] = $i;
             $template_file_max[$n] = $i;
             $n++;
          }
      }
   }

#   for ($i = 0; $i < $n; $i++) {
#      print "$i $template_file[$i] - $template_file_min[$i]  $template_file_max[$i]\n";
#   }
   return;
}

#
# leap year: 0/1
#
sub leap_year {
   my ($year);
   $year = $_[0];
   if ($calendar == 365) { return 0; }
   if ($year % 4 != 0) { return 0; }
   if ($year % 400 == 0) { return 1; }
   if ($year % 100 == 0) { return 0; }
   return 1;
}

#
# return the Julian day 1..365/366
# julian(year, month, day)
#
sub julian {

   my ($year,$mon, $day, $n);

   $year=$_[0];
   $mon=$_[1];
   $day=$_[2];

   $n=substr(" 000 031 059 090 120 151 181 212 243 273 304 334",($mon-1)*4,4);
   $n = $n + $day;

   if ($calendar eq '365') { return $n; }
   
   if ($mon > 2) { $n += leap_year($year); }

   return $n;
}

# unjulian(julian_day,year)
# julian day (1..366) to "MMDD"

sub unjulian {

   my  ($julian, $n, $mon, $day, $year, $leap);
   $julian=$_[0];
   $year=$_[1];
   $leap = leap_year($year);
   if ($leap == 1) {
       if ($julian == 31 + 29) { return "0229"; }
       if ($julian > 31 + 28) { $julian--; }
   }

   for ($mon = 12; $mon > 0; $mon--) {
      $n=substr(" 000 031 059 090 120 151 181 212 243 273 304 334",($mon-1)*4,4);
      if ($julian > $n) {
          $day = $julian - $n;
          return sprintf("%2.2d%2.2d", $mon, $day);
      }
   }
   die "fatal error in unjulian\n";
}
