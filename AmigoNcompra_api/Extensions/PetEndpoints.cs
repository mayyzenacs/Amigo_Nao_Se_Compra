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
        var publicGroup = app.MapGroup("/pets").RequireRateLimiting("fixed");

        publicGroup.MapGet("/", async (AppDbContext db) => 
            await db.Pets.AsNoTracking().ToListAsync());
        
        publicGroup.MapGet("showcase", async (AppDbContext db) =>
        {
            var randomShowcase = await db.Pets
                .AsNoTracking()
                .OrderBy(p => EF.Functions.Random())
                .Take(5)
                .ToListAsync();
            return Results.Ok(randomShowcase);
        });

        var adminGroup = app.MapGroup("/pets").RequireRateLimiting("strict").RequireAuthorization("AdminOnly");

        adminGroup.MapPost("add", async (PetRequest request, AppDbContext db, Cloudinary cloudinary) =>
        {
            if (string.IsNullOrWhiteSpace(request.Name)) return Results.BadRequest("PET_NAME_REQUIRED");

            string finalPetPhoto = request.Photo;

            if (!string.IsNullOrWhiteSpace(request.Photo))
            {
                var result = await cloudinary.UploadAsync(new ImageUploadParams 
                {
                    File = new FileDescription(request.Photo),
                    Folder = "amigo-nao-se-compra/pets",
                    PublicId = $"pet_{Guid.NewGuid()}"
                });

                if (result.Error == null) finalPetPhoto = result.SecureUrl.ToString();
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
                
                return Results.Created($"/pets/{newPet.Id}", newPet);
            }
            catch (DbUpdateException) 
            {
                return Results.Conflict(new { code = "INTERNAL_ERROR" });
            }
        }); 

        adminGroup.MapPut("update/{id:Guid}", async (Guid id, PetUpdateRequest request, AppDbContext db, Cloudinary cloudinary) => {

            string updatePetPhoto = request.Photo;

            if (!string.IsNullOrWhiteSpace(request.Photo))
            {
                var upload = await cloudinary.UploadAsync(new ImageUploadParams {
                    File = new FileDescription(request.Photo),
                    Folder = "amigo-nao-se-compra/pets",
                    PublicId = $"pet_{Guid.NewGuid()}"});

                updatePetPhoto = upload.SecureUrl.ToString();
            }

            var affectedPet = await db.Pets
                .Where(p => p.Id == id)
                .ExecuteUpdateAsync(s => s
                .SetProperty(p => p.Name, p => request.Name ?? p.Name)
                .SetProperty(p => p.Photo, p => updatePetPhoto ?? p.Photo));

            return affectedPet > 0 ? Results.Ok(new { 
                id, 
                name = request.Name, 
                photo = updatePetPhoto}) : Results.NotFound(new { code = "PET_NOT_FOUND" });

        });

        adminGroup.MapDelete("delete/{id:Guid}", async (Guid id, AppDbContext db)=>
        {
            var affectedPet = await db.Pets
                .Where(p => p.Id == id)
                .ExecuteDeleteAsync();

            return affectedPet > 0 ? Results.NoContent() : Results.NotFound(new { code = "PET_NOT_FOUND" });

        });
    }
}