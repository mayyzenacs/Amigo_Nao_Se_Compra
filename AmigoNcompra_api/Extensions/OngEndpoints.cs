using AmigoNcompra_api.Data;
using Microsoft.EntityFrameworkCore;
using AmigoNcompra_api.DTOS;
using AmigoNcompra_api.Models;
using AmigoNcompra_api.utils;
using CloudinaryDotNet.Actions;
using CloudinaryDotNet;

namespace AmigoNcompra_api.Extensions;

public static class OngEndpoints
{
    public static void MapOngEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api");

        group.MapGet("cities/list", async (AppDbContext db) => 
            await db.Cities.AsNoTracking().Select(c => c.Name).ToListAsync());

        group.MapGet("ongs", async (AppDbContext db) => 
            await db.Ongs.ToListAsync());

        group.MapPost("ongs/add", async (OngRequest request, AppDbContext db, Cloudinary cloudinary) =>
        {
            if (string.IsNullOrWhiteSpace(request.Name)) return Results.BadRequest("name is required");

            // string finalOngPhoto = request.Photo;

            // if(!string.IsNullOrWhiteSpace(request.Photo))
            // {
            //     var upload = new ImageUploadParams()
            //     {
            //         File = new FileDescription(request.Photo),
            //         Folder = "amigo-nao-se-compra/ongs",
            //         PublicId = $"ong_{Guid.NewGuid()}"
            //     };

            // var uploadResult = await cloudinary.UploadAsync(upload);

            // if (uploadResult.Error == null) finalOngPhoto = uploadResult.SecureUrl.ToString();
    
            // }

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
                Photo = request.Photo
            };

            try
            {
                db.Ongs.Add(newOng);
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return Results.Conflict("this ong already exists"); 
            }

            return Results.Created($"/ongs/{newOng.Id}", newOng);
        });

        group.MapGet("ongs/search", async (string? city, AppDbContext db) =>
        {
            if (string.IsNullOrWhiteSpace(city)) return Results.BadRequest("city name is required to search");

            var normalizeCity = city.SearchToken();

            var cityExists = await db.Cities.AnyAsync(c => c.NormalizedName == normalizeCity);
            if (!cityExists) return Results.BadRequest(new { message = "Essa cidade não consta no mapa do IBGE." });
          

            var ongsFound = await db.Ongs.AsTracking()
                .Where(o => o.NormalizedCity == normalizeCity)
                .ToListAsync();

            if (ongsFound.Count == 0)
            {
                var suggestions = await db.Ongs
                    .AsNoTracking()
                    .OrderBy(r => EF.Functions.Random())
                    .Take(3)
                    .ToListAsync();

                return Results.Ok(new 
                { 
                    message = $"No ongs found in {normalizeCity}.",
                    suggestions = suggestions,
                    data = ongsFound 
                });
            }

            return Results.Ok(new SearchResponse(ongsFound));
        });
        
    }
}