using System.ComponentModel.DataAnnotations;

namespace AmigoNcompra_api.DTOS; 

public record PetRequest(
    [Required] [MaxLength(50)] string Name,
    [Required] [MaxLength(500)] string Photo
);