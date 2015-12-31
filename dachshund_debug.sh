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
# Path to the executeable of Node.js
######################################################
readonly NODE_EXECUTEABLE=$(./tools/getNodejsInstallation.sh)

######################################################
# Starts Dachshund with remote debugging enabled
# in case the bash script was started with '-debug'
# flag the application breaks at the first line and
# has to be continued with the remote debugger
######################################################
if [[ "$1" = "--debug" ]]
then
    ${NODE_EXECUTEABLE} --debug-brk --harmony apps/main.js &
else
    ${NODE_EXECUTEABLE} --debug --harmony apps/main.js &
fi
DACHSHUND_PROCESS_ID=$!
sleep 1
read -p "Press [Enter] key to end process..."
kill $DACHSHUND_PROCESS_ID