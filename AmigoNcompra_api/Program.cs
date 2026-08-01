using System.Text.Json.Serialization;
using AmigoNcompra_api.Data;
using AmigoNcompra_api.Extensions;
using Microsoft.EntityFrameworkCore;
using CloudinaryDotNet;
using AmigoNcompra_api.Models;
using AmigoNcompra_api.utils;

var builder = WebApplication.CreateBuilder(args);

DotNetEnv.Env.Load();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
                       ?? (builder.Environment.IsProduction() 
                            ? "Data Source=/app/data/amigonaosecompra.db" 
                            : "Data Source=data/amigonaosecompra.db"); 

var cloudName = Environment.GetEnvironmentVariable("CLOUD_NAME");
var apiKey = Environment.GetEnvironmentVariable("API_KEY");
var apiSecret = Environment.GetEnvironmentVariable("API_SECRET");
var account = new Account(cloudName, apiKey, apiSecret);
var cloudinaryInstance = new Cloudinary(account);
cloudinaryInstance.Api.Secure = true;
builder.Services.AddSingleton(cloudinaryInstance);

builder.Services.ConfigureHttpJsonOptions(options => {
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

var allowedOrigins = Environment.GetEnvironmentVariable("ALLOWED_ORIGINS")
                     ?? (builder.Environment.IsProduction() 
                         ? "https://amigonaosecompra.mayradev.me" 
                         : "http://localhost:8080");

var origins = allowedOrigins.Split(';');

builder.Services.AddCors(options => {
    options.AddPolicy("AllowReact", policy => 
        policy.WithOrigins(origins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials());
});

builder.Services.RateLimitingConfig();

builder.Services.AddSingleton<TokenService>();
builder.Services.AddJwtAuthentication();
builder.Services.AddDbContext<AppDbContext>();

builder.Services.AddHttpClient();

builder.Services.AddOpenApi();

builder.Services.AddMemoryCache();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddOutputCache(options =>
{
    options.AddBasePolicy(builder => builder.Expire(TimeSpan.FromMinutes(2)));
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReact");

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        if (context.Database.GetPendingMigrations().Any())
        {
            context.Database.Migrate();
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Error while applying migrations.");
    }
}

app.UseRateLimiter();
app.UseAuthentication(); 
app.UseAuthorization();

var apiGroup = app.MapGroup("/api");

apiGroup.MapAuthEndpoints();
apiGroup.MapOngEndpoints();
apiGroup.MapPetEndpoints();

app.UseOutputCache();

app.MapGet("/health", () => Results.Ok());

_ = Task.Run(async () => await SeedCities(app)); 

async Task SeedCities(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (await db.Cities.AnyAsync()) return;

    var client = new HttpClient();

    try
    {
        var response = await client.GetFromJsonAsync<List<IBGECity>>("https://servicodados.ibge.gov.br/api/v1/localidades/municipios");

        if (response != null)
        {
            var cities = response.Select(c => new CityReference
            {
                Id = c.id,
                Name = c.nome ?? "Desconhecido",
                NormalizedName = (c.nome ?? "CIDADE").SearchToken()
            }).ToList();

            db.Cities.AddRange(cities);
            await db.SaveChangesAsync();
            
            Console.WriteLine($"[SEED]: {cities.Count} cidades importadas com sucesso.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[SEED ERROR]: Falha ao buscar cidades do IBGE: {ex.Message}");
    }
}


app.Run();

public record IBGECity(int id, string nome);