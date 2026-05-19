namespace AmigoNcompra_api.Models.Enums;

[Flags]
public enum ActivityType
{
    Adocao = 1,        
    RecebeDoacao = 2,    
    Resgate = 4,
    Castracao = 8
}