using AmigoNcompra_api.Data;
using AmigoNcompra_api.DTOS;
using AmigoNcompra_api.Models;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.EntityFrameworkCore;

namespace AmigoNcompra_api.Extensions;

public static class PetEndpoints
{
    public static void MapPetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api");

        group.MapGet("pets", async (AppDbContext db) => 
            await db.Pets.ToListAsync());

        group.MapPost("pets/add", async (PetRequest request, AppDbContext db, Cloudinary cloudinary) =>
        {
            if (string.IsNullOrWhiteSpace(request.Name)) return Results.BadRequest("PET_NAME_REQUIRED");

            string finalPetPhoto = request.Photo;

            if (!string.IsNullOrWhiteSpace(request.Photo))
            {
                var upload = new ImageUploadParams()
                {
                    File = new FileDescription(request.Photo), 
                    Folder = "amigo-nao-se-compra/pets", 
                    PublicId = $"ong_{Guid.NewGuid()}"
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