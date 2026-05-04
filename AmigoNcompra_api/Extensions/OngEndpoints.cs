using Microsoft.EntityFrameworkCore;
namespace AmigoNcompra_api.Extensions;

public static class OngEndpoints
{
    public static void MapOngEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api");

        group.MapGet("/cities", async (DbContext db) =>
        {
            var cities = await db.ApprovedOngs
                .Select(o => o.City)
                .Distinct()
                .ToListAsync();
            return Results.Ok(cities);
        });

        
    }
}