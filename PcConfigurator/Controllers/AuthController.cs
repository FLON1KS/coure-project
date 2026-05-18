using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PcConfigurator.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PcConfigurator.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        // Той самий ключ, що і в Program.cs
        private readonly string _secretKey = "SuperSecretKeyForMyUniversityProject2026!"; 

        public AuthController(AppDbContext context) => _context = context;

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username && u.Password == request.Password);

            if (user == null) return Ok(ApiResponse<object>.Error("Невірний логін або пароль"));

            if (user.Username == "kolchanovvladimiru@gmail.com") 
            {
                user.Role = "Admin"; 
                await _context.SaveChangesAsync(); 
            }
            // 1. Формуємо "паспортні дані" (Claims) для токена
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            // 2. Створюємо криптографічний підпис
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // 3. Збираємо сам JWT токен (дійсний 1 день)
            var tokenDescriptor = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );
            
            string jwt = new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);

            var userData = new { username = user.Username, role = user.Role, token = jwt };
            return Ok(new ApiResponse<object>(userData, "Вхід успішний"));
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User newUser)
        {
            if (await _context.Users.AnyAsync(u => u.Username == newUser.Username))
                return Ok(ApiResponse<object>.Error("Користувач з таким логіном вже існує"));

            newUser.Role = "User"; // За замовчуванням всі звичайні користувачі
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();
            return Ok(new ApiResponse<object>(newUser, "Реєстрація успішна"));
        }
    }
}