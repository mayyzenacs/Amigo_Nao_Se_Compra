using AmigoNcompra_api.Data;
using AmigoNcompra_api.Extensions;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);


var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
                       ?? "Data Source=amigonaosecompra.db";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddOpenApi();

var app = builder.Build();

builder.Services.AddCors(options => {
    options.AddDefaultPolicy(policy => 
        policy.WithOrigins("https://mayyzenacs.github.io")
              .AllowAnyMethod()
              .AllowAnyHeader());
});

app.UseCors();

app.MapOngEndpoints();
app.MapPetEndpoints();

app.MapGet("/health", () => Results.Ok());

app.Run();
