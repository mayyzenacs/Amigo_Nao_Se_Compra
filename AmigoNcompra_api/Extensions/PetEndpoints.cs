namespace AmigoNcompra_api.Extensions;

public static class PetEndpoints
{
    public static void MapPetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api");

        group.MapGet("/pets", () => 
        {
            return Results.Ok(new[] {
                new { Id = 1, Name = "Rex", Breed = "SRD", Photo = "/dog1.jpg" },
                new { Id = 2, Name = "Luna", Breed = "Siamês", Photo = "/cat1.jpg" }
            });
        });
    }
}