#!/usr/bin/php
<?php

# Read incoming date string, only last 8 characters because we want YYMMDDHH:
$dateStr = substr($argv[1], -8);

# Read in the base control file:
$ctlDir = '/home/scripts/grads/grads_ctl/NAM';
$baseCtl = file_get_contents($ctlDir . '/BASE.ctl');

# Define what the place holder strings are:
$placeHolderOne = '%DATESTRINGONE%';
$placeHolderTwo = '%DATESTRINGTWO%';

# First one's easy, just replace with passed date string:
$newCtl = str_replace($placeHolderOne, $dateStr, $baseCtl);

# Second one's a little harder, run it through DateTime to get the right string (12Z11jul2017):
$dtTwo = DateTime::createFromFormat('ymdH', $dateStr);
$dateStrTwoP1 = $dtTwo->format('H') . 'Z';
$dateStrTwoP2 = strtolower($dtTwo->format('dMY'));
$dateStrTwo = $dateStrTwoP1 . $dateStrTwoP2;
$newCtl = str_replace($placeHolderTwo, $dateStrTwo, $newCtl);

# Write out the final control file:
$fileName = $ctlDir . '/' . $dtTwo->format('H') . 'NAM.ctl';
file_put_contents($fileName, $newCtl);

?>