#!/bin/bash

BASEDIR="$(cd $(dirname $0) && pwd)"
BUILD_PATH="$BASEDIR/modules"

while [ "$1" != "" ]; do
    case $1 in
	    
        -bp | --buildpath )
        	if [ "$2" != "" ]; then
				    BUILD_PATH=$2
				    shift
			    fi
		;;

        -? | -h | --help )
            echo " Usage: bash build.sh [PARAMETER] [[PARAMETER], ...]"
            echo "    Parameters:"
            echo "      -bp, --buildpath           output path"
            echo "      -?, -h, --help             this help"
            echo "  Examples"
            echo "  bash build.sh -bp /etc/systemd/system/"
            exit 0
    ;;

		* )
			echo "Unknown parameter $1" 1>&2
			exit 1
		;;
    esac
  shift
done

PRODUCT="docspace"
BASE_DIR="/var/www/${PRODUCT}"
PATH_TO_CONF="/etc/onlyoffice/${PRODUCT}"
STORAGE_ROOT="${PATH_TO_CONF}/data"
LOG_DIR="/var/log/onlyoffice/${PRODUCT}"
DOTNET_RUN="/usr/bin/dotnet"
NODE_RUN="/usr/bin/node"
APP_URLS="http://0.0.0.0"
ENVIRONMENT=" --ENVIRONMENT=production"
CORE=" --core:products:folder=${BASE_DIR}/products --core:products:subfolder=server"

SERVICE_NAME=(
	api
	urlshortener
	socket
	studio-notify
	notify 
	people-server
	files
	files-services
	studio
	backup
	telegram-service
	ssoauth
	webhooks-service
	clear-events
	backup-background
	migration
	doceditor
	migration-runner
	)

reassign_values (){
  case $1 in
	api )
		SERVICE_PORT="5000"
		WORK_DIR="${BASE_DIR}/studio/ASC.Web.Api/"
		EXEC_FILE="ASC.Web.Api.dll"
	;;
	urlshortener )
		SERVICE_PORT="5029"
		WORK_DIR="${BASE_DIR}/services/ASC.UrlShortener/"
		EXEC_FILE="index.js"
	;;
	socket )
		SERVICE_PORT="5028"
		WORK_DIR="${BASE_DIR}/services/ASC.Socket.IO/"
		EXEC_FILE="server.js"
	;;
	studio-notify )
		SERVICE_PORT="5006"
		WORK_DIR="${BASE_DIR}/services/ASC.Studio.Notify/"
		EXEC_FILE="ASC.Studio.Notify.dll"
	;;
	notify )
		SERVICE_PORT="5005"
		WORK_DIR="${BASE_DIR}/services/ASC.Notify/"
		EXEC_FILE="ASC.Notify.dll"
	;;
	people-server )
		SERVICE_PORT="5004"
		WORK_DIR="${BASE_DIR}/products/ASC.People/server/"
		EXEC_FILE="ASC.People.dll"
	;;
	files )
		SERVICE_PORT="5007"
		WORK_DIR="${BASE_DIR}/products/ASC.Files/server/"
		EXEC_FILE="ASC.Files.dll"
	;;
	files-services )
		SERVICE_PORT="5009"
		WORK_DIR="${BASE_DIR}/products/ASC.Files/service/"
		EXEC_FILE="ASC.Files.Service.dll"
	;;
	studio )
		SERVICE_PORT="5003"
		WORK_DIR="${BASE_DIR}/studio/ASC.Web.Studio/"
		EXEC_FILE="ASC.Web.Studio.dll"
	;;
	backup )
		SERVICE_PORT="5012"
		WORK_DIR="${BASE_DIR}/services/ASC.Data.Backup/"
		EXEC_FILE="ASC.Data.Backup.dll"
	;;
	telegram-service )
		SERVICE_PORT="51702"
		WORK_DIR="${BASE_DIR}/services/ASC.TelegramService/"
		EXEC_FILE="ASC.TelegramService.dll"
	;;
	ssoauth )
		SERVICE_PORT="9834"
		WORK_DIR="${BASE_DIR}/services/ASC.SsoAuth/"
		EXEC_FILE="app.js"
	;;
	webhooks-service )
		SERVICE_PORT="5031"
		WORK_DIR="${BASE_DIR}/services/ASC.Webhooks.Service/"
		EXEC_FILE="ASC.Webhooks.Service.dll"
	;;
	clear-events )
		SERVICE_PORT="5027"
		WORK_DIR="${BASE_DIR}/services/ASC.ClearEvents/"
		EXEC_FILE="ASC.ClearEvents.dll"
	;;
	backup-background )
		SERVICE_PORT="5032"
		WORK_DIR="${BASE_DIR}/services/ASC.Data.Backup.BackgroundTasks/"
		EXEC_FILE="ASC.Data.Backup.BackgroundTasks.dll"
	;;
	migration )
		SERVICE_PORT="5018"
		WORK_DIR="${BASE_DIR}/services/ASC.Migration/"
		EXEC_FILE="ASC.Migration.dll"
	;;
	doceditor )
		SERVICE_PORT="5013"
		WORK_DIR="${BASE_DIR}/products/ASC.Files/editor/"
		EXEC_FILE="server.js"
	;;
	migration-runner )
		WORK_DIR="${BASE_DIR}/services/ASC.Migration.Runner/"
		EXEC_FILE="ASC.Migration.Runner.dll"
	;;
  esac
  SERVICE_NAME="$1"
  if [[ "${EXEC_FILE}" == *".js" ]]; then
  	SERVICE_TYPE="simple"
	EXEC_START="${NODE_RUN} ${WORK_DIR}${EXEC_FILE} --app.port=${SERVICE_PORT} --app.appsettings=${PATH_TO_CONF} --app.environment=${ENVIRONMENT}"
  elif [[ "${SERVICE_NAME}" = "migration-runner" ]]; then
    SERVICE_TYPE="notify"
	EXEC_START="${DOTNET_RUN} ${WORK_DIR}${EXEC_FILE}"
  else
  	SERVICE_TYPE="notify"	
	EXEC_START="${DOTNET_RUN} ${WORK_DIR}${EXEC_FILE} --urls=${APP_URLS}:${SERVICE_PORT} --pathToConf=${PATH_TO_CONF} \
	--'\$STORAGE_ROOT'=${STORAGE_ROOT} --log:dir=${LOG_DIR} --log:name=${SERVICE_NAME}${CORE}${ENVIRONMENT}"
  fi
}

write_to_file () {
  sed -i -e 's#${SERVICE_NAME}#'$SERVICE_NAME'#g' -e 's#${WORK_DIR}#'$WORK_DIR'#g' -e \
  "s#\${EXEC_START}#$EXEC_START#g" -e "s#\${SERVICE_TYPE}#$SERVICE_TYPE#g" $BUILD_PATH/${PRODUCT}-${SERVICE_NAME[$i]}.service
}

mkdir -p $BUILD_PATH

for i in ${!SERVICE_NAME[@]}; do
  cp $BASEDIR/service $BUILD_PATH/${PRODUCT}-${SERVICE_NAME[$i]}.service
  reassign_values "${SERVICE_NAME[$i]}"
  write_to_file $i
done
