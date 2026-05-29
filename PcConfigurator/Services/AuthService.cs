using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using PcConfigurator.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PcConfigurator.Services;

public class AuthService
{
    private readonly AppDbContext _context;
    private readonly PasswordHasher<User> _passwordHasher = new();

    public AuthService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ServiceResult<LoginResult>> LoginAsync(LoginRequest request)
    {
        string username = request.Username.Trim();

        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(request.Password))
        {
            return ServiceResult<LoginResult>.Fail("Невірний логін або пароль");
        }

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == username);

        if (user == null)
        {
            return ServiceResult<LoginResult>.Fail("Невірний логін або пароль");
        }

        bool passwordOk = CheckPassword(user, request.Password, out bool passwordChanged);
        if (!passwordOk)
        {
            return ServiceResult<LoginResult>.Fail("Невірний логін або пароль");
        }

        if (user.Username == AuthSettings.AdminEmail && user.Role != "Admin")
        {
            user.Role = "Admin";
            passwordChanged = true;
        }

        if (passwordChanged)
        {
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

    public async Task<ServiceResult<RegisterResult>> RegisterAsync(RegisterRequest request)
    {
        string username = request.Username.Trim();

        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(request.Password))
        {
            return ServiceResult<RegisterResult>.Fail("Заповніть логін та пароль");
        }

        bool exists = await _context.Users.AnyAsync(u => u.Username == username);
        if (exists)
        {
            return ServiceResult<RegisterResult>.Fail("Користувач з таким логіном вже існує");
        }

        var user = new User
        {
            Username = username,
            Role = "User",
            Password = string.Empty
        };

        user.Password = _passwordHasher.HashPassword(user, request.Password);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var result = new RegisterResult
        {
            Username = user.Username,
            Role = user.Role
        };

        return ServiceResult<RegisterResult>.Ok(result, "Реєстрація успішна");
    }

    private bool CheckPassword(User user, string password, out bool passwordChanged)
    {
        passwordChanged = false;

        try
        {
            var result = _passwordHasher.VerifyHashedPassword(user, user.Password, password);

            if (result == PasswordVerificationResult.Success)
            {
                return true;
            }

            if (result == PasswordVerificationResult.SuccessRehashNeeded)
            {
                user.Password = _passwordHasher.HashPassword(user, password);
                passwordChanged = true;
                return true;
            }
        }
        catch (FormatException)
        {
        }

        // Legacy migration path для старих записів з plain-text паролями.
        // Після першого входу такий пароль одразу замінюється на hash.
        if (user.Password == password)
        {
            user.Password = _passwordHasher.HashPassword(user, password);
            passwordChanged = true;
            return true;
        }

        return false;
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
