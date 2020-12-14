FROM mcr.microsoft.com/dotnet/sdk:5.0
EXPOSE 8080
EXPOSE 4443
WORKDIR /source

COPY . . 

RUN dotnet build 
RUN dotnet publish "MyWebProj.csproj" -c Release -o /app/publish

WORKDIR /app/publish 
ENTRYPOINT ["dotnet", "MyWebProj.dll"]

# ENTRYPOINT [] (to use base image entry point)

# ENTRYPOINT ["tail", "-f", "/dev/null"] # to keep container running 
