using AmigoNcompra_api.Data;
using AmigoNcompra_api.DTOS;
using AmigoNcompra_api.Models;
using Microsoft.EntityFrameworkCore;

namespace AmigoNcompra_api.Extensions;

public static class PetEndpoints
{
    public static void MapPetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api");

        group.MapGet("pets", async (AppDbContext db) => 
            await db.Pets.ToListAsync());

        group.MapPost("pets/add", async (PetRequest request, AppDbContext db) =>
        {
            if (string.IsNullOrWhiteSpace(request.Name)) return Results.BadRequest("name is required");

            var newPet = new Pet
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Photo = request.Photo
            };

            try
            {
                db.Pets.Add(newPet);
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException) {
                return Results.Conflict( new { err = "an error occurred"});
            }

            return Results.Created($"/ongs/{newPet.Id}", newPet);
        });

        group.MapGet("pets/showcase", async (AppDbContext db) =>
        {
            var randomShowcase = await db.Pets
                .AsNoTracking()
                .OrderBy(p => EF.Functions.Random())
                .Take(5)
                .ToListAsync();

            return Results.Ok(randomShowcase);
        });

        
    }
}