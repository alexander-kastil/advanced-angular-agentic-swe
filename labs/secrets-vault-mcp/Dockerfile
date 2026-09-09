FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY labs/secrets-vault-mcp/secrets-vault-mcp.csproj labs/secrets-vault-mcp/
RUN dotnet restore labs/secrets-vault-mcp/secrets-vault-mcp.csproj
COPY labs/secrets-vault-mcp/. labs/secrets-vault-mcp/
RUN dotnet publish labs/secrets-vault-mcp/secrets-vault-mcp.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app/publish .
COPY db/secrets-vault-mcp/create-schema.sql db/secrets-vault-mcp/load-data.sql /app/db/
ENV ASPNETCORE_URLS=http://+:5093
EXPOSE 5093
HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=20s \
    CMD curl -f http://127.0.0.1:5093/health || exit 1
ENTRYPOINT ["dotnet", "secrets-vault-mcp.dll"]
