using System.ComponentModel.DataAnnotations;

namespace AmigoNcompra_api.Models;

public class Pet
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(50)] 
    public required string Name { get; set; }

    [Required]
    [MaxLength(500)] 
    public required string Photo { get; set; }
}