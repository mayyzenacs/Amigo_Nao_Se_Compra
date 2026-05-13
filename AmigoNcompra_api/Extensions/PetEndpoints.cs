using AmigoNcompra_api.Data;
using AmigoNcompra_api.DTOS;
using AmigoNcompra_api.Models;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.EntityFrameworkCore;
using Superpower.Model;

namespace AmigoNcompra_api.Extensions;

public static class PetEndpoints
{
    public static void MapPetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/pets");

        group.MapGet("/", async (AppDbContext db) => 
            await db.Pets.AsNoTracking().ToListAsync());

        group.MapPost("add", async (PetRequest request, AppDbContext db, Cloudinary cloudinary) =>
        {
            if (string.IsNullOrWhiteSpace(request.Name)) return Results.BadRequest("PET_NAME_REQUIRED");

            string finalPetPhoto = request.Photo;

            if (!string.IsNullOrWhiteSpace(request.Photo))
            {
                var upload = new ImageUploadParams()
                {
                    File = new FileDescription(request.Photo), 
                    Folder = "amigo-nao-se-compra/pets", 
                    PublicId = $"pet_{Guid.NewGuid()}"
                };

            var uploadResult = await cloudinary.UploadAsync(upload);

            if (uploadResult.Error == null) finalPetPhoto = uploadResult.SecureUrl.ToString();

            }

            var newPet = new Pet
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Photo = finalPetPhoto
            };

            try
            {
                db.Pets.Add(newPet);
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException) {
                return Results.Conflict( new { err = "INTERNAL_ERROR"});
            }

            return Results.Created($"/ongs/{newPet.Id}", newPet);
        });

        group.MapGet("showcase", async (AppDbContext db) =>
        {
            var randomShowcase = await db.Pets
                .AsNoTracking()
                .OrderBy(p => EF.Functions.Random())
                .Take(5)
                .ToListAsync();

            return Results.Ok(randomShowcase);
        });

        group.MapPut("update/{id:Guid}", async (Guid id, PetUpdateRequest request, AppDbContext db) => {

            var affectedRows = await db.Pets
                .Where(p => p.Id == id)
                .ExecuteUpdateAsync(setters => setters
                .SetProperty(p => p.Name, request.NewName)
                .SetProperty(p => p.Photo, request.NewPhoto));

            return affectedRows > 0 
                ? Results.Ok(new { message = "PET_UPDATED" }) 
                : Results.NotFound(new { code = "PET_NOT_FOUND" });
        });

        group.MapDelete("delete/{id:Guid}", async (Guid id, AppDbContext db)=>
        {
            var affectedRows = await db.Pets
                .Where(p => p.Id == id)
                .ExecuteDeleteAsync();

            return affectedRows > 0 
                ? Results.NoContent() 
                : Results.NotFound(new { code = "PET_NOT_FOUND" });

        });
    }
}