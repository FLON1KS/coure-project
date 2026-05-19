using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PcConfigurator.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PcConfigurator.Services;

public class AuthService
{
    private readonly AppDbContext _context;

    public AuthService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ServiceResult<LoginResult>> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == request.Username && u.Password == request.Password);

        if (user == null)
        {
            return ServiceResult<LoginResult>.Fail("Невірний логін або пароль");
        }

        if (user.Username == AuthSettings.AdminEmail && user.Role != "Admin")
        {
            user.Role = "Admin";
            await _context.SaveChangesAsync();
        }

        var result = new LoginResult
        {
            Username = user.Username,
            Role = user.Role,
            Token = CreateJwtToken(user)
        };

        return ServiceResult<LoginResult>.Ok(result, "Вхід успішний");
    }

    public async Task<ServiceResult<User>> RegisterAsync(User newUser)
    {
        bool exists = await _context.Users.AnyAsync(u => u.Username == newUser.Username);
        if (exists)
        {
            return ServiceResult<User>.Fail("Користувач з таким логіном вже існує");
        }

        newUser.Role = "User";
        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        return ServiceResult<User>.Ok(newUser, "Реєстрація успішна");
    }

    private string CreateJwtToken(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(AuthSettings.SecretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
