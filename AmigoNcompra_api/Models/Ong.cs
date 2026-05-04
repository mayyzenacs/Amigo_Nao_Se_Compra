namespace AmigoNcompra_api.Models;

public class Ong
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string City { get; set; }
    public required string Contact { get; set; }
    public string? Website { get; set; }
    public required string Activities { get; set; }
    public DateTime RequestDate { get; set; } = DateTime.UtcNow;
}