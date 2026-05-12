
using AmigoNcompra_api.Models;

namespace AmigoNcompra_api.DTOS;

public record SearchResponse(
    List<Ong> Data,
    List<Ong>? Suggestions = null,
    string? Message = null
);