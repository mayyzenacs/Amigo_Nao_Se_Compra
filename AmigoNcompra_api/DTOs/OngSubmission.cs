namespace AmigoNcompra_api.Models;

public class OngSubmission
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string City { get; set; }
    public required string Contact { get; set; }
    public string? Website { get; set; }
    public required string Activities { get; set; }
    public DateTime RequestDate { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "PENDING_CURATION";
}