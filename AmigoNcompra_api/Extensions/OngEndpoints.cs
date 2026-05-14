using AmigoNcompra_api.Data;
using Microsoft.EntityFrameworkCore;
using AmigoNcompra_api.DTOS;
using AmigoNcompra_api.Models;
using AmigoNcompra_api.utils;
using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Identity;

namespace AmigoNcompra_api.Extensions;

public static class OngEndpoints
{
    public static void MapOngEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/ongs");

        group.MapGet("cities/list", async (AppDbContext db) => 
            await db.Cities.AsNoTracking().Select(c => c.Name).ToListAsync());

        group.MapGet("/", async (AppDbContext db) => 
            await db.Ongs.AsNoTracking().ToListAsync());

        group.MapPost("add", async (OngRequest request, AppDbContext db, Cloudinary cloudinary) =>
        {
            if (string.IsNullOrWhiteSpace(request.Name)) return Results.BadRequest("CITY_NAME_REQUIRED");

            // string finalOngPhoto = request.Photo;

            // if (!string.IsNullOrWhiteSpace(request.Photo))
            // {
            //     var result = await cloudinary.UploadAsync(new ImageUploadParams 
            //     {
            //         File = new FileDescription(request.Photo),
            //         Folder = "amigo-nao-se-compra/ongs",
            //         PublicId = $"ong_{Guid.NewGuid()}"
            //     });

            //     if (result.Error == null) finalOngPhoto = result.SecureUrl.ToString();
            // } 

            // --->>> RETIRAR ANTES DA PRODUçÃO e ALTERAR REQUEST.PHOTO PARA FINALONGPHOTO. <<<-----

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
                return Results.Conflict("ONG_ALREADY_EXISTS"); 
            }

            return Results.Created($"/ongs/{newOng.Id}", newOng);
        });

        group.MapGet("search", async (string? city, AppDbContext db) =>
        {
            if (string.IsNullOrWhiteSpace(city)) return Results.BadRequest("CITY_NAME_REQUIRED");

            var normalizeCity = city.SearchToken();

            var cityExists = await db.Cities.AnyAsync(c => c.NormalizedName == normalizeCity);
            if (!cityExists) return Results.BadRequest(new { code = "CITY_INVALID" });
          

            var ongsFound = await db.Ongs
                .AsTracking()
                .Where(o => o.NormalizedCity == normalizeCity)
                .ToListAsync();

            if (ongsFound.Count == 0)
            {
                var suggestions = await db.Ongs
                    .AsNoTracking()
                    .OrderBy(r => EF.Functions.Random())
                    .Take(3)
                    .ToListAsync();

                return Results.Ok(new SearchResponse(
                    ongsFound,
                    suggestions,
                    "ONG_NOT_FOUND"
                ));
            }

            return Results.Ok(new SearchResponse(ongsFound));
        });

        group.MapPut("update/{id:Guid}", async (Guid id, OngUpdateRequest request, AppDbContext db, Cloudinary cloudinary) => {

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
        
        group.MapDelete("delete{id:Guid}", async (Guid id, AppDbContext db) =>
        {
            var affectedOng = await db.Ongs
                .Where(o => o.Id == id)
                .ExecuteDeleteAsync();

            return affectedOng > 0 ? Results.NoContent() : Results.NotFound(new { code = "ONG_NOT_FOUND" });

        });
    }
}