using System.ComponentModel.DataAnnotations;
using AmigoNcompra_api.Models;

namespace AmigoNcompra_api.DTOS; 

public record OngRequest(
    [Required] [MaxLength(100)] string Name,
    [Required] [MaxLength(50)] string City,
    string? Website,
    [Required] [MaxLength(100)] string Contact,
    [Required] ActivityType Activities,
    [Required] [MaxLength(250)] string About,
    [Required] [MaxLength(500)] string Photo
);