# Kurnik.NET 2018
# Original source, by MICHAL DYMEL:
#   https://devblog.dymel.pl/2017/07/11/aspnetcore-docker-gitlab/

# Stage 1: Build
FROM microsoft/aspnetcore-build AS build
WORKDIR /Kurnik.NET

# caches restore result by copying csproj file separately
COPY *.sln .
COPY Source/*.csproj ./Source/
COPY Tests/*.csproj ./Tests/
RUN dotnet restore

# copies the rest of your code
COPY . .
RUN dotnet publish --output /Kurnik.NET/ --configuration Release


# Stage 2: Tests
FROM microsoft/aspnetcore-build AS test
WORKDIR /Kurnik.NET
COPY --from=build /Kurnik.NET .
ENTRYPOINT ["dotnet", "vstest", "Kurnik.Tests.dll"]


# Stage 3: Release
FROM microsoft/aspnetcore AS release
WORKDIR /Kurnik.NET
COPY --from=build /Kurnik.NET .
ENTRYPOINT ["dotnet", "Kurnik.dll"]
