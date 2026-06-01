using AmigoNcompra_api.utils;
using Microsoft.AspNetCore.Identity.Data;

namespace AmigoNcompra_api.Extensions;

public record LoginRequest(string Username, string Password);

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/login", (LoginRequest request, TokenService tokenService) =>
        {
            var adminUser = Environment.GetEnvironmentVariable("ADMIN_USERNAME");
            var adminPass = Environment.GetEnvironmentVariable("ADMIN_PASSWORD");

           if (string.IsNullOrEmpty(adminUser) || string.IsNullOrEmpty(adminPass)) return Results.Problem("Variáveis de ambiente de administração não configuradas no servidor.");

           if (request.Username == adminUser && request.Password == adminPass)
            {
                var token = tokenService.GenerateToken(request.Username, "Admin");
                return Results.Ok(new { token });
            }
            
            return Results.Unauthorized();
            
        }).RequireRateLimiting("strict");
    }
}