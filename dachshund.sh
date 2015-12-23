#!/bin/bash


log_path="/var/log/dachshund/"
current_log_link=$log_path"dachshund.log"

#Change to the root directory of Dachshund
cd `dirname $0`

application_directory=`pwd`

#Create path to log files for the case that the path doesn't exists
if [ ! -d $log_path  ]
then
	echo "Global log path [$log_path] doesn't exists. Take application log directory."
	log_path="$application_directory/logs/"
	current_log_link=$log_path"dachshund.log"
	if [ ! -d $log_path  ]
	then
		mkdir $log_path
	fi
fi

#Command which is called in the case that the application gets terminated
term ()
{
        echo "Terminate application..."
        exit 0
}

#Register the method from above to be called on application terminaten
trap term SIGINT SIGTERM

while [ 1 ]
do
	#Cleanup log files which are older than 14 days
	find $log_path -type f -mtime +14 -exec rm {} \;

	#Create new log file and point with a link to it
	#With this configuration one log get created per day
	NOW=$(date +"%m-%d-%Y")
	log_file="$log_path$NOW.dachshund.log"
        touch $log_file
	if [ -e $current_log_link ]; then
		rm $current_log_link
	fi
	ln -s $log_file $current_log_link

	#Start the main javascript file of Dachshund
	echo `date +"%m-%d-%Y %T"` "Start 'Dachshund'" >> $log_file
	node  --harmony apps/main.js >> $log_file
	echo `date +"%m-%d-%Y %T"` "Stopped 'Dachshund'" >> $log_file

	#Wait for termination
        wait $!
done
