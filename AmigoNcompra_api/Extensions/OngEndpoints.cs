using AmigoNcompra_api.Data;
using Microsoft.EntityFrameworkCore;
using AmigoNcompra_api.DTOS;
using AmigoNcompra_api.Models;

namespace AmigoNcompra_api.Extensions;

public static class OngEndpoints
{
    public static void MapOngEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api");

        group.MapGet("/ongs", async (AppDbContext db) => 
            await db.Ongs.ToListAsync());

        // group.MapPost("/ongs/add", async (OngRequest request, AppDbContext db) =>
        // {
        //     if (string.IsNullOrWhiteSpace(request.Name)) return Results.BadRequest("name is required");

        //     var newOng = new Ong
        //     {
        //         Id = Guid.NewGuid(),
        //         Name = request.Name,
        //         City = request.City,
        //         NormalizedCity = NormalizeText(request.City),
        //         Website = request.Website,
        //         Contact = request.Contact,
        //         Activities = request.Activities,
        //         About = request.About,
        //         Photo = request.Photo
        //     };

        //     try
        //     {
        //         db.Ongs.Add(newOng);
        //         await db.SaveChangesAsync();
        //     }
        //     catch (DbUpdateException)
        //     {
        //         return Results.Conflict("this ong already exists"); 
        //     }

        //     return Results.Created($"/ongs/{newOng.Id}", newOng);
        // });

        group.MapGet("ongs/search", async (string? city, AppDbContext db) =>
        {
           if (string.IsNullOrWhiteSpace(city)) return Results.BadRequest("city name is required to search");

           var normalizeCity = city.Trim();
           var query = db.Ongs.AsNoTracking();

           var ongsFound = await query
            .Where(o => o.City.ToLower() == normalizeCity.ToLower())
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

            return Results.Ok(ongsFound); 
        });
    }
}