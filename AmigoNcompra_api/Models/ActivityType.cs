namespace AmigoNcompra_api.Models;

[Flags]
public enum ActivityType
{
    None = 0,
    Adocao = 1,        
    RecebeDoacao = 2,    
    Resgate = 4         
}