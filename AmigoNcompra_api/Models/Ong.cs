using System.ComponentModel.DataAnnotations;
using AmigoNcompra_api.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace AmigoNcompra_api.Models;

[Index(nameof(City))] 
public class Ong
{
    public Guid Id { get; set; }

    [Required] [MaxLength(100)]
    public required string Name { get; set; }

    [Required] [MaxLength(50)]
    public required string City { get; set; }
    public required string NormalizedCity { get; set; }

    [MaxLength(200)]
    public string? Website { get; set; }

    [Required] [MaxLength(100)]
    public required string Contact { get; set; }
    
    [Required]
    public required ActivityType Activities { get; set; }

    [Required] [MaxLength(250)]
    public required string About { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)] 
    public required string Photo { get; set; }
}