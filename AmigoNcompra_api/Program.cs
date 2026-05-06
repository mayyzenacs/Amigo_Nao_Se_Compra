using AmigoNcompra_api.Data;
using AmigoNcompra_api.Extensions; 
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options => {
    options.AddDefaultPolicy(policy => 
        policy.WithOrigins("")
              .AllowAnyMethod()
              .AllowAnyHeader());
});

builder.Services.AddOpenApi();

var app = builder.Build();

app.UseCors();

app.MapOngEndpoints();
app.MapPetEndpoints();

app.MapGet("/health", () => Results.Ok());

app.Run();
