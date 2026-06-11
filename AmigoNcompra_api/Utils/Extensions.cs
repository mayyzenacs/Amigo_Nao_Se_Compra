using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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

        services.AddAuthorizationBuilder()
            .AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    }

    public static void RateLimitingConfig(this IServiceCollection services)
    {
        services.AddRateLimiter(options =>
        {
            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
            {
                return RateLimitPartition.GetSlidingWindowLimiter("global-limit", _ => new SlidingWindowRateLimiterOptions
                {
                    PermitLimit = 500,
                    Window = TimeSpan.FromSeconds(10),
                    SegmentsPerWindow = 2,
                    QueueLimit = 100,
                    AutoReplenishment = true
                });
            });

            options.AddPolicy("fixed", httpContext => RateLimitPartition.GetTokenBucketLimiter(
                partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                factory: _ => new TokenBucketRateLimiterOptions
                {
                    TokenLimit = 40,         
                    TokensPerPeriod = 10,     
                    ReplenishmentPeriod = TimeSpan.FromSeconds(15),
                    QueueLimit = 20,
                }));

            options.AddPolicy("strict", httpContext => RateLimitPartition.GetSlidingWindowLimiter(
                    partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                    factory: _ => new SlidingWindowRateLimiterOptions
                    {
                        PermitLimit = 5, 
                        Window = TimeSpan.FromMinutes(1),
                        SegmentsPerWindow = 6, 
                        QueueLimit = 5,
                        AutoReplenishment = true
                    }));

            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
        });
    }
}