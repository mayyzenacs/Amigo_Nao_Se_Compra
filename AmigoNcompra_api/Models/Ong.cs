using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace AmigoNcompra_api.Models;

[Index(nameof(City))] 
public class Ong
{
    public int Id { get; set; }

    [Required] [MaxLength(100)]
    public required string Name { get; set; }

    [Required] [MaxLength(50)]
    public required string City { get; set; }

    [MaxLength(200)]
    public string? Website { get; set; }

    [Required] [MaxLength(100)]
    public required string Contact { get; set; }
    
    [Required]
    public required ActivityType Activities { get; set; }

    [Required] [MaxLength(250)]
    public required string About { get; set; } = string.Empty;
    
}