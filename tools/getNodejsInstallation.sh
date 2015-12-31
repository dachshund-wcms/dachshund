#!/usr/bin/env bash

######################################################
# Change to to the directory of the executable
######################################################
cd `dirname $0`

######################################################
# Read the Node.js installation configuration
######################################################
source ../config/nodejsInstallation.cfg

######################################################
# Change the context of the to the root folder of
# Dachshund
######################################################
cd ..

######################################################
# Find the local installation of Node.js within the
# Dachshund installation folder
######################################################
function findLocalNodeInstallation {
    echo $(find . -maxdepth 1 -type d -name 'node-*' | head -n1)
}

######################################################
# Lookup the path for the system or local installation
######################################################
readonly NODEJS_BIN_PATH=$(${WHICH_EXECUTEABLE_PATH} ${NODEJS_BIN})
readonly NODE_BIN_PATH=$(${WHICH_EXECUTEABLE_PATH} ${NODE_BIN})
readonly NODEJS_LOCAL_INSTALLATION=$(findLocalNodeInstallation)

######################################################
# Lookup the operating system if it's Mac OS or Linux
######################################################
platform="unknown"
operatingSystem=$(uname)
if [ "${operatingSystem}" == "Linux" ]; then
   platform="linux"
elif [ "${operatingSystem}" == "Darwin" ]; then
   platform="darwin"
fi

######################################################
# Lookup the processor architecture if it's x86, x64
# or ARM
######################################################
architecture=$(uname -m)
if [ "${architecture}" == "x86_64" ]; then
    architecture="x64"
fi

######################################################
# Check if system installation, in case it exists,
# is up to date, the minimum Node.js version for
# Dachshund is 5.0.0
######################################################
nodeVersion=""
nodeVersionIsOutdated=false
if [ -n "${NODEJS_BIN_PATH}" ]; then
    nodeVersion=$(${NODEJS_BIN_PATH} --version)
elif [ -n "${NODE_BIN_PATH}" ]; then
    nodeVersion=$(${NODE_BIN_PATH} --version)
fi

if [[ ! "${nodeVersion}" =~ ^v([5-9]|\d{2,})\..*$ ]]; then
    >&2 echo "System installation has version [${nodeVersion}] which is not compatible with Dachshund"
    >&2 echo "Will switch to local installation"
    nodeVersionIsOutdated=true
fi

######################################################
# Evaluates which Node.js installation shall be taken
# The evaluation is executed with the following order:
#   1. Use external local installation
#   2. Use local installation
#   3. Download, unpack and use local installation
#   4. Use system installation of 'nodejs' executable
#   5. Use system installation of 'node' executable
######################################################
if [ -n "${EXTERNAL_NODEJS_INSTALLATION_PATH}" ]; then
    >&2 echo "External local installation: ${EXTERNAL_NODEJS_INSTALLATION_PATH}"
    echo ${EXTERNAL_NODEJS_INSTALLATION_PATH}${NODEJS_LOCAL_INSTALLTION_BIN_PATH}
elif [ ${nodeVersionIsOutdated} = true ] || [ ${USE_LOCAL_NODEJS_INSTALLATION_PREFERRED} = true ] || ([ -z "${NODEJS_BIN_PATH}" ] && [ -z "${NODE_BIN_PATH}" ]); then
    if [ -n "${NODEJS_LOCAL_INSTALLATION}" ]; then
        >&2 echo "Local installation: ${NODEJS_LOCAL_INSTALLATION}"
        echo ${NODEJS_LOCAL_INSTALLATION}${NODEJS_LOCAL_INSTALLTION_BIN_PATH}
    elif [ ${DOWNLOAD_NODEJS_AUTOMATICALLY} = true ] && [ "${platform}" != "unknown" ]; then
        fileName="node-${NODEJS_RELEASE_VERSION}-${platform}-${architecture}.tar.gz"
        nodeJsDownloadUrl="${NODEJS_DISTRIBUTION_BASE_URL}${fileName}"
        >&2 echo "Download local installation: ${nodeJsDownloadUrl}"
        rm "${fileName}" 2> /dev/null
        wget –O "${fileName}" "${nodeJsDownloadUrl}" 1>&2
        >&2 echo "Unpack local installation: ${fileName}"
        tar xfz "${fileName}"
        rm "${fileName}"
        echo "$(findLocalNodeInstallation)${NODEJS_LOCAL_INSTALLTION_BIN_PATH}"
    else
        >&2 echo "No local installation found!"
        exit 1
    fi
elif [ -n "${NODEJS_BIN_PATH}" ]; then
    >&2 echo "System installation: ${NODEJS_BIN_PATH}"
    echo ${NODEJS_BIN_PATH}
elif [ -n "${NODE_BIN_PATH}" ]; then
    >&2 echo "System installation: ${NODE_BIN_PATH}"
    echo ${NODE_BIN_PATH}
fi