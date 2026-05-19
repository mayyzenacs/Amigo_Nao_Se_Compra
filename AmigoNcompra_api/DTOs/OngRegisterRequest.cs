using System.ComponentModel.DataAnnotations;
using AmigoNcompra_api.Models.Enums;

namespace AmigoNcompra_api.DTOS; 

public record OngRegisterRequest(
    [Required] [MaxLength(100)] string Name,
    [Required] [MaxLength(50)] string CityUf,
    [Required] [MaxLength(100)] string ContactUrl,
    [MaxLength(300)] string? WebsiteLink,
    [Required] [MaxLength(250)] string Activities
);