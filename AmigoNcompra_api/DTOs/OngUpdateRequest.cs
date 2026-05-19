using System.ComponentModel.DataAnnotations;
using AmigoNcompra_api.Models.Enums;

namespace AmigoNcompra_api.DTOS; 

public record OngUpdateRequest(
    [MaxLength(100)] string? Name,
    [MaxLength(50)] string? City,
    [MaxLength(300)] string? Website,
    [MaxLength(100)] string? Contact,
    ActivityType? Activities,
    [MaxLength(250)] string? About,
    [MaxLength(500)] string? Photo
);