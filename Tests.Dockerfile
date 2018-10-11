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
COPY Tests/*.csproj ./Tests/
RUN dotnet restore

# copies the rest of your code
COPY . .
RUN dotnet publish --output /Kurnik.NET-dev/ --configuration Release

# Stage 2: Tests
FROM microsoft/dotnet:2.1-sdk AS test
WORKDIR /Kurnik.NET
COPY --from=build /Kurnik.NET-dev .
ENTRYPOINT ["dotnet", "vstest", "Kurnik.Tests.dll"]
