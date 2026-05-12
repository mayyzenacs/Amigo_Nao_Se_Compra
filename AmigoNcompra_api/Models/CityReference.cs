namespace AmigoNcompra_api.Models;

public class CityReference
{
    public int Id { get; set; } 
    public required string Name { get; set; }
    public required string NormalizedName { get; set; } 
}