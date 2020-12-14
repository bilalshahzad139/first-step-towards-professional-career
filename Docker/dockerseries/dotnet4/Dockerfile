FROM mcr.microsoft.com/dotnet/framework/sdk:4.8 as build
WORKDIR /app/src

COPY src/. /app/src/

RUN nuget restore
RUN msbuild /p:Configuration=Release

FROM mcr.microsoft.com/dotnet/framework/aspnet:4.8 AS runtime
WORKDIR /inetpub/wwwroot
COPY --from=build /app/src/. ./
