#!/bin/bash

cd `dirname $0`

export PATH=$PATH:apps/runtimeTests/node_modules/phantomjs/bin

#node apps/mainTests.js
#if [ "$?" = "1" ]; then
#	echo "----------------------------------------------"
#	echo "There are errors in the nodeunit tests."
#	echo "Fix them first before starting the application."
#	echo "----------------------------------------------"
#	exit 1
#fi

if [[ "$1" = "--debug" ]]
then
    node --debug-brk --harmony apps/main.js &
else
    node --debug --harmony apps/main.js &
fi
DACHSHUND_PROCESS_ID=$!
sleep 1
#node  apps/mainRuntimeTests.js
read -p "Press [Enter] key to end process..."
#echo Kill Process id $ELASTICSEARCH_PROCESS_ID
#kill $ELASTICSEARCH_PROCESS_ID
kill $DACHSHUND_PROCESS_ID