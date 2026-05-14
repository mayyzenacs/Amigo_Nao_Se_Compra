using System.ComponentModel.DataAnnotations;

namespace AmigoNcompra_api.DTOS; 

public record PetUpdateRequest(
    [MaxLength(50)] string? Name,
    [MaxLength(500)] string? Photo
);