using System.ComponentModel.DataAnnotations;
using AmigoNcompra_api.Models.Enums;

namespace AmigoNcompra_api.DTOS; 

public record OngRequest(
    [Required] [MaxLength(100)] string Name,
    [Required] [MaxLength(50)] string City,
    [MaxLength(300)] string? Website,
    [Required] [MaxLength(100)] string Contact,
    [Required] ActivityType Activities,
    [Required] [MaxLength(300)] string About,
    [Required] [MaxLength(500)] string Photo
);