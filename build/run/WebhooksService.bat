echo "RUN ASC.Webhooks.Service"
call dotnet run --project ..\..\common\services\ASC.Webhooks.Services\ASC.Webhooks.Services.csproj --no-build --$STORAGE_ROOT=..\..\..\Data --log__dir=..\..\..\Logs --log__name=webhooks