#!/usr/bin/env bash

######################################################
# Exit bash script in case on error occurs during
# executing the subsequent steps
######################################################
set -e

######################################################
# Change to to the directory of the executable, this
# ensures that the context in which this script is
# executed is the root folder of Dachshund
######################################################
cd `dirname $0`

######################################################
# Path to the Dachshund installation
######################################################
readonly APPLICATION_DIRECTORY=$(pwd)

######################################################
# Path to the executeable of Node.js
######################################################
readonly NODE_EXECUTEABLE=$(./tools/getNodejsInstallation.sh)

######################################################
# Path to log files
######################################################
log_path="/var/log/dachshund/"
current_log_link=$log_path"dachshund.log"

######################################################
# Create path to log files in case that the path
# doesn't exist
######################################################
if [ ! -d $log_path  ]
then
	echo "Global log path [$log_path] doesn't exists. Take application log directory."
	log_path="$APPLICATION_DIRECTORY/logs/"
	current_log_link=$log_path"dachshund.log"
	if [ ! -d $log_path  ]
	then
		mkdir $log_path
	fi
fi

######################################################
# Command which is called in the case that the
# application gets terminated with CTRL+C
######################################################
term ()
{
        echo "Terminate application..."
        exit 0
}

######################################################
# Register the method from above to be called on
# application terminaten
######################################################
trap term SIGINT SIGTERM

######################################################
# Endless loop in case the application server dies
# the instance gets restarted automatically
######################################################
while [ 1 ]
do
	# Cleanup log files which are older than 14 days
	find $log_path -type f -mtime +14 -exec rm {} \;

	# Create new log file and point with a link to it
	# With this configuration one log get created per day
	NOW=$(date +"%m-%d-%Y")
	log_file="$log_path$NOW.dachshund.log"
        touch $log_file
	if [ -e $current_log_link ]; then
		rm $current_log_link
	fi
	ln -s $log_file $current_log_link

	# Start the main javascript file of Dachshund
	echo `date +"%m-%d-%Y %T"` "Start 'Dachshund'" >> $log_file
	${NODE_EXECUTEABLE} --harmony apps/main.js >> $log_file 2>&1
	echo `date +"%m-%d-%Y %T"` "Stopped 'Dachshund'" >> $log_file

	# Wait for termination
	wait $!
done
