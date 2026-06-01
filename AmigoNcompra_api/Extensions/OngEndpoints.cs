using AmigoNcompra_api.Data;
using Microsoft.EntityFrameworkCore;
using AmigoNcompra_api.DTOS;
using AmigoNcompra_api.Models;
using AmigoNcompra_api.utils;
using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using System.Text.Json;
using System.Text;

namespace AmigoNcompra_api.Extensions;

public static class OngEndpoints
{
    public static void MapOngEndpoints(this IEndpointRouteBuilder app)
    {
        var publicGroup = app.MapGroup("/ongs").RequireRateLimiting("fixed");

        publicGroup.MapGet("/", GetOngPages);

        publicGroup.MapGet("search", async (string? city, AppDbContext db) =>
        {
            if (string.IsNullOrWhiteSpace(city)) return Results.BadRequest("CITY_NAME_REQUIRED");
    
            var normalizeCity = city.SearchToken();

            var cityExists = await db.Cities.AnyAsync(c => c.NormalizedName == normalizeCity);
            if (!cityExists) return Results.BadRequest(new { code = "CITY_INVALID" });

            var ongsFound = await db.Ongs
                .AsTracking()
                .Where(o => o.NormalizedCity == normalizeCity)
                .OrderBy(o => EF.Functions.Random())
                .ToListAsync();

            if (ongsFound.Count == 0)
            {
                var suggestions = await db.Ongs
                    .AsNoTracking()
                    .OrderBy(r => EF.Functions.Random())
                    .Take(4)
                    .ToListAsync();

                return Results.Ok(new SearchResponse(
                    ongsFound,
                    suggestions,
                    "ONG_NOT_FOUND"
                ));
            }

            return Results.Ok(new SearchResponse(ongsFound));
        });

        var adminGroup = app.MapGroup("/ongs").RequireAuthorization("AdminOnly").RequireRateLimiting("strict");

        adminGroup.MapPost("add", async (OngRequest request, AppDbContext db, Cloudinary cloudinary) =>
        {
            if (string.IsNullOrWhiteSpace(request.Name)) return Results.BadRequest("CITY_NAME_REQUIRED");

            string finalOngPhoto = request.Photo;

            if (!string.IsNullOrWhiteSpace(request.Photo))
            {
                var result = await cloudinary.UploadAsync(new ImageUploadParams 
                {
                    File = new FileDescription(request.Photo),
                    Folder = "amigo-nao-se-compra/ongs",
                    PublicId = $"ong_{Guid.NewGuid()}"
                });

                if (result.Error == null) finalOngPhoto = result.SecureUrl.ToString();
            }

            var newOng = new Ong
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                City = request.City,
                NormalizedCity = request.City.SearchToken(),
                Website = string.IsNullOrWhiteSpace(request.Website) ? null : request.Website,
                Contact = request.Contact,
                Activities = request.Activities,
                About = request.About,
                Photo = finalOngPhoto
            };

            try
            {
                db.Ongs.Add(newOng);
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return Results.Conflict("ONG_ALREADY_EXISTS"); 
            }

            return Results.Created($"/ongs/{newOng.Id}", newOng);
        });

        adminGroup.MapPut("update/{id:Guid}", async (Guid id, OngUpdateRequest request, AppDbContext db, Cloudinary cloudinary) => {

            string updateOngPhoto = request.Photo;

            if (!string.IsNullOrWhiteSpace(request.Photo))
            {
                var upload = await cloudinary.UploadAsync(new ImageUploadParams {
                    File = new FileDescription(request.Photo),
                    Folder = "amigo-nao-se-compra/ongs",
                    PublicId = $"ong_{Guid.NewGuid()}"});

                updateOngPhoto = upload.SecureUrl.ToString();
            }
            
            var affectedOng = await db.Ongs
                .Where(o => o.Id == id)
                .ExecuteUpdateAsync(setters => setters
                .SetProperty(p => p.Name, p => request.Name ?? p.Name)
                .SetProperty(p => p.City, p => request.City ?? p.City)
                .SetProperty(p => p.Website, p => request.Website ?? p.Website)
                .SetProperty(p => p.Contact, p => request.Contact ?? p.Contact)
                .SetProperty(p => p.Activities, p => request.Activities ?? p.Activities)
                .SetProperty(p => p.About, p => request.About ?? p.About)
                .SetProperty(p => p.Photo, p => updateOngPhoto ?? p.Photo)
                );

             return affectedOng > 0 ? Results.Ok(new { id, data = request, photo = updateOngPhoto }) : Results.NotFound(new { code = "ONG_NOT_FOUND" });
        });
        
        adminGroup.MapDelete("delete/{id:Guid}", async (Guid id, AppDbContext db) =>
        {
            var affectedOng = await db.Ongs
                .Where(o => o.Id == id)
                .ExecuteDeleteAsync();

            return affectedOng > 0 ? Results.NoContent() : Results.NotFound(new { code = "ONG_NOT_FOUND" });

        });

        app.MapPost("ongs/register", async (OngRegisterRequest request, IHttpClientFactory httpClientFactory) =>
        {
            var envData = DotNetEnv.Env.Load();
            var webhookUrl = Environment.GetEnvironmentVariable("WEB_HOOK_REGISTER");
            if (string.IsNullOrEmpty(webhookUrl)) return Results.Problem("WEBHOOK_NOT_FOUND");

            var discordMessage = new
            {
                username = "Amigo Não Se Compra - BotBob",
                avatar_url = "",
                embeds = new[]
                {new
                    {
                        title = "🚨 NOVA SOLICITAÇÃO DE TRIAGEM ONG PARCEIRA",
                        color = 15548997, 
                        fields = new[]
                        {
                            new { name = "Instituição", value = request.Name, inline = true },
                            new { name = "Cidade/UF", value = request.CityUf, inline = true },
                            new { name = "Contato", value = request.ContactUrl, inline = false },
                            new { name = "Site", value = request.WebsiteLink ?? "N/A", inline = false },
                            new { name = "Atividades", value = request.Activities, inline = false }
                        },timestamp = DateTime.UtcNow
                    }
                }
            };
            
            var client = httpClientFactory.CreateClient();
            var content = new StringContent(JsonSerializer.Serialize(discordMessage), Encoding.UTF8, "application/json");
            
            var response = await client.PostAsync(webhookUrl, content);

            if (response.IsSuccessStatusCode)
                return Results.Ok(new { message = "SUCCESS_REGISTER_SEND" });

            return Results.Problem("ERR_MESSAGE_NOT_DELIVERED");
        }).RequireRateLimiting("strict");

        app.MapGet("cities/list", async (AppDbContext db) => await db.Cities.AsNoTracking().Select(c => c.Name).ToListAsync());
    
        }
    private static async Task<IResult> GetOngPages(
        int page = 1, 
        int pageSize = 20, 
        AppDbContext db = null!)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 50) pageSize = 20; 

        var query = db.Ongs.AsNoTracking();

        var totalItems = await query.CountAsync();
        var totalPages = (totalItems + pageSize - 1) / pageSize;

        var ongs = await query
            .OrderBy(o => o.Name)
            .ThenBy(o => o.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Results.Ok(new
        {
            data = ongs,
            pagination = new
            {
                currentPage = page,
                pageSize = pageSize,
                totalItems = totalItems,
                totalPages = totalPages,
                hasNextPage = page < totalPages,
                hasPreviousPage = page > 1
            }
        });
    }
}