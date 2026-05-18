using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PcConfigurator.Models;
using Microsoft.AspNetCore.Authorization; // Для [Authorize]

namespace PcConfigurator.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdsController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAllAds()
        {
            var ads = await _context.HardwareAds.OrderByDescending(a => a.CreatedAt).ToListAsync();
            return Ok(new ApiResponse<List<HardwareAd>>(ads));
        }

        // [Authorize] означає, що сюди пропустить тільки з дійсним JWT токеном
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateAd([FromBody] HardwareAd newAd)
        {
            // Магія JWT: Сервер сам розшифровує токен і дістає з нього ім'я! (Без звернення до БД)
            newAd.OwnerUsername = User.Identity?.Name ?? "Гість";

            _context.HardwareAds.Add(newAd);
            await _context.SaveChangesAsync();
            return Ok(new ApiResponse<HardwareAd>(newAd, "Оголошення успішно створено"));
        }

  [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAd(int id, [FromBody] HardwareAd updatedAd)
        {
            var ad = await _context.HardwareAds.FindAsync(id);
            if (ad == null) return NotFound(ApiResponse<object>.Error("Оголошення не знайдено."));

            // Перевіряємо, чи має користувач права на редагування (Адмін або власник)
            if (!User.IsInRole("Admin") && ad.OwnerUsername != User.Identity?.Name)
            {
                return StatusCode(403, ApiResponse<object>.Error("Ви можете редагувати лише власні оголошення."));
            }

            // Оновлюємо дані
            ad.Title = updatedAd.Title;
            ad.Description = updatedAd.Description;
            ad.Price = updatedAd.Price;
            ad.ContactInfo = updatedAd.ContactInfo;
            ad.Category = updatedAd.Category;
            
            // Оновлюємо картинку ТІЛЬКИ якщо користувач завантажив нову
            if (!string.IsNullOrEmpty(updatedAd.ImageBase64))
            {
                ad.ImageBase64 = updatedAd.ImageBase64; 
            }

            await _context.SaveChangesAsync();
            return Ok(new ApiResponse<HardwareAd>(ad, "Оголошення успішно оновлено."));
        }
    }
}