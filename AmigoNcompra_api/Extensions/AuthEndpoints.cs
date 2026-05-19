using AmigoNcompra_api.utils;
using Microsoft.AspNetCore.Identity.Data;

namespace AmigoNcompra_api.Extensions;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/login", (LoginRequest request, TokenService tokenService) =>
        {
            var adminEmail = Environment.GetEnvironmentVariable("ADMIN_EMAIL");
            var adminPass = Environment.GetEnvironmentVariable("ADMIN_PASSWORD");

            if (request.Email == adminEmail && request.Password == adminPass)
            {
                var token = tokenService.GenerateToken(request.Email, "Admin");
                return Results.Ok(new { token });
            }
            return Results.Unauthorized();
        }).RequireRateLimiting("fixed");
    }
}