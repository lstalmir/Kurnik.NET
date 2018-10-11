# Kurnik.NET 2018
# Original source, by MICHAL DYMEL:
#   https://devblog.dymel.pl/2017/07/11/aspnetcore-docker-gitlab/

# Stage 1: Build
FROM microsoft/dotnet:2.1-sdk AS build
WORKDIR /Kurnik.NET-build

# caches restore result by copying csproj file separately
COPY *.sln .
COPY Source/*.csproj ./Source/
COPY Engine/*.csproj ./Engine/
# remove tests project from solution
RUN dotnet sln remove ./Tests/Kurnik.Tests.csproj
RUN dotnet restore

# copies the rest of your code
COPY . .
RUN dotnet publish ./Source/Kurnik.csproj --output /Kurnik.NET-bin/ --configuration Release

# Stage 2: Release
FROM microsoft/dotnet:2.1-aspnetcore-runtime AS release
WORKDIR /Kurnik.NET
COPY --from=build /Kurnik.NET-bin .
ENTRYPOINT ["dotnet", "Kurnik.dll"]
