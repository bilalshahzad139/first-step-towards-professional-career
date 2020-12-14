FROM mcr.microsoft.com/dotnet/framework/sdk:4.8 as build
WORKDIR /app/src

COPY src/. /app/src/
 
RUN nuget restore
RUN msbuild /p:Configuration=Release

FROM mcr.microsoft.com/dotnet/framework/aspnet:4.8 AS runtime
EXPOSE 443
WORKDIR /Https
COPY aspnetapp.pfx .

WORKDIR /MyApp
COPY --from=build /app/src/. ./

RUN Remove-WebSite -Name 'Default Web Site'
RUN New-Website -Name 'MyApp' -IPAddress '*' -Port 443 -PhysicalPath C:\MyApp -ApplicationPool '.NET v4.5' -Ssl -SslFlags 0

RUN powershell.exe -Command "\
  # The following 2 imports are necessary to do the below SslBindings ; \
  Import-Module IISAdministration; \
  Import-Module WebAdministration; \
  # If you have a password on your SSL Cert, put it here as it needs "secured". If not, remove this line and the argument below it; \
  $pwd = ConvertTo-SecureString -String 'password' -Force -AsPlainText; \
  # Import the certificate and store it in a variable to bind to later; \
  $cert = Import-PfxCertificate -Exportable -FilePath 'C:\https\aspnetapp.pfx' -CertStoreLocation cert:\localMachine\My -Password $pwd; \
  # Take the imported certificate and bind it to all traffic toward port 443 (you need to specify IP if you want multiple apps on 1 docker which I believe is ill-advised); \
  new-item -Path IIS:\SslBindings\0.0.0.0!443 -value $cert;"

