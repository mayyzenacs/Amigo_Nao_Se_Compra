FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /App

COPY ["AmigoNcompra_api/AmigoNcompra-api.csproj", "AmigoNcompra_api/"]
RUN dotnet restore "AmigoNcompra_api/AmigoNcompra-api.csproj"

COPY . .
WORKDIR "/App/AmigoNcompra_api"
RUN dotnet publish "AmigoNcompra-api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
EXPOSE 80
COPY --from=build /app/publish .

RUN mkdir -p /app/data
ENV ConnectionStrings__DefaultConnection="Data Source=/app/data/amigonaosecompra.db"

ENTRYPOINT ["dotnet", "AmigoNcompra-api.dll"]