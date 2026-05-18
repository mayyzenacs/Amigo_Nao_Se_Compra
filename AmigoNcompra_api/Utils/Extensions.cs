using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;

namespace AmigoNcompra_api.utils;

public static class Extensions
{
    public static void AddJwtAuthentication(this IServiceCollection services)
    {
        var secretKey = Environment.GetEnvironmentVariable("JWT_KEY");
        if (string.IsNullOrEmpty(secretKey)) throw new Exception("JWT_SECRET_KEY missing!");

        var keyBytes = Encoding.ASCII.GetBytes(secretKey);

        services.AddAuthentication(opt => {
            opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(opt => {
            opt.RequireHttpsMetadata = false;
            opt.SaveToken = true;
            opt.TokenValidationParameters = new TokenValidationParameters {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero 
            };
        });

        services.AddAuthorization(options => {
            options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
        });
    }

    public static void RateLimitingConfig(this IServiceCollection services)
    {
        services.AddRateLimiter(options =>
        {
            options.AddFixedWindowLimiter("fixed", opt =>
            {
                opt.PermitLimit = 8; 
                opt.Window = TimeSpan.FromMinutes(1);
                opt.QueueLimit = 0; 
            });

            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
        });
    }
}