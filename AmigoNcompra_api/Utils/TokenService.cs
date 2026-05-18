using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace AmigoNcompra_api.utils;

public class TokenService
{
    public string GenerateToken(string email, string role)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        
        var key = Encoding.ASCII.GetBytes(Environment.GetEnvironmentVariable("JWT_KEY")!);
        var expiresHours = int.Parse(Environment.GetEnvironmentVariable("JWT_EXPIRES_HOURS") ?? "2");

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity([
                new Claim(ClaimTypes.Name, email),
                new Claim(ClaimTypes.Role, role)
            ]),
            Expires = DateTime.UtcNow.AddHours(expiresHours),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key), 
                SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}