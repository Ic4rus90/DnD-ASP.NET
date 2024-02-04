FROM mcr.microsoft.com/dotnet/sdk:6.0 as build

WORKDIR /app

COPY . ./
RUN dotnet restore "src/lootefix/lootefix.csproj"
RUN dotnet publish  -c Release -o release --no-restore "src/lootefix/lootefix.csproj"


FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app/release .
ENTRYPOINT ["dotnet", "lootefix.dll"]
