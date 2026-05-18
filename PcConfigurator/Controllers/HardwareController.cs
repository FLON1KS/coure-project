using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using PcConfigurator.Models;

namespace PcConfigurator.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HardwareController : ControllerBase
    {
        private readonly AppDbContext _context;

        // 1. ДЕЛЕГАТИ ТА ПОДІЇ (Events)
        // Оголошуємо делегат для події додавання нового товару
        public delegate void ItemAddedHandler(string itemName, string category);
        
        // Сама подія. Використовуємо static, щоб вона працювала глобально для логера
        public static event ItemAddedHandler? OnItemAdded;

        // 2. КОНСТРУКТОР
        public HardwareController(AppDbContext context)
        {
            _context = context;
            
            // Підписуємо метод логування на подію (щоб уникнути дублювання підписок, 
            // перевіряємо чи він вже не підписаний - класичний прийом студента)
            OnItemAdded -= LogItemToJsonAsync; 
            OnItemAdded += LogItemToJsonAsync;
        }

        // 3. РОБОТА З JSON ФАЙЛАМИ + АСИНХРОННІСТЬ
        // Цей метод спрацьовує автоматично, коли викликається подія OnItemAdded
        private async void LogItemToJsonAsync(string itemName, string category)
        {
            string filePath = "logs.json";
            var logEntry = new { Time = DateTime.Now, Item = itemName, Category = category };
            
            List<object> logs = new List<object>();

            try
            {
                // Читаємо існуючий файл, якщо він є
                if (System.IO.File.Exists(filePath))
                {
                    string json = await System.IO.File.ReadAllTextAsync(filePath);
                    if (!string.IsNullOrEmpty(json))
                    {
                        logs = JsonSerializer.Deserialize<List<object>>(json) ?? new List<object>();
                    }
                }

                // Додаємо новий запис та зберігаємо назад у файл
                logs.Add(logEntry);
                string newJson = JsonSerializer.Serialize(logs, new JsonSerializerOptions { WriteIndented = true });
                await System.IO.File.WriteAllTextAsync(filePath, newJson);
            }
            catch (Exception ex)
            {
                // Якщо файл зайнятий, просто ігноруємо (щоб не покласти весь сервер)
                Console.WriteLine($"Помилка запису логів: {ex.Message}");
            }
        }


        // --- МЕТОДИ API (Використовуємо Generics - ApiResponse<T>) ---

        [HttpGet("cpus")]
        public async Task<IActionResult> GetCpus()
        {
            var cpus = await _context.Cpus.ToListAsync();
            // Повертаємо дані, запаковані в наш універсальний клас
            return Ok(new ApiResponse<List<Cpu>>(cpus));
        }

        [HttpPost("cpus")]
        public async Task<IActionResult> AddCpu([FromBody] Cpu newCpu)
        {
            _context.Cpus.Add(newCpu);
            await _context.SaveChangesAsync();

            // Викликаємо подію! Усі підписані методи (наш логер) спрацюють
            OnItemAdded?.Invoke(newCpu.Name, "Процесор");

            return Ok(new ApiResponse<Cpu>(newCpu, "Процесор успішно додано до бази"));
        }

        [HttpGet("motherboards")]
        public async Task<IActionResult> GetMotherboards()
        {
            var mbs = await _context.Motherboards.ToListAsync();
            return Ok(new ApiResponse<List<Motherboard>>(mbs));
        }

        [HttpPost("motherboards")]
        public async Task<IActionResult> AddMotherboard([FromBody] Motherboard newMb)
        {
            _context.Motherboards.Add(newMb);
            await _context.SaveChangesAsync();
            
            OnItemAdded?.Invoke(newMb.Name, "Материнська плата");
            
            return Ok(new ApiResponse<Motherboard>(newMb, "Плату успішно додано"));
        }

        [HttpGet("rams")]
        public async Task<IActionResult> GetRams()
        {
            var rams = await _context.Rams.ToListAsync();
            return Ok(new ApiResponse<List<Ram>>(rams));
        }

        [HttpPost("rams")]
        public async Task<IActionResult> AddRam([FromBody] Ram newRam)
        {
            _context.Rams.Add(newRam);
            await _context.SaveChangesAsync();
            OnItemAdded?.Invoke(newRam.Name, "ОЗУ");
            return Ok(new ApiResponse<Ram>(newRam));
        }

        [HttpGet("gpus")]
        public async Task<IActionResult> GetGpus()
        {
            var gpus = await _context.Gpus.ToListAsync();
            return Ok(new ApiResponse<List<Gpu>>(gpus));
        }

        [HttpPost("gpus")]
        public async Task<IActionResult> AddGpu([FromBody] Gpu newGpu)
        {
            _context.Gpus.Add(newGpu);
            await _context.SaveChangesAsync();
            OnItemAdded?.Invoke(newGpu.Name, "Відеокарта");
            return Ok(new ApiResponse<Gpu>(newGpu));
        }

        [HttpGet("powersupplies")]
        public async Task<IActionResult> GetPowerSupplies()
        {
            var psus = await _context.PowerSupplies.ToListAsync();
            return Ok(new ApiResponse<List<PowerSupply>>(psus));
        }

        [HttpPost("powersupplies")]
        public async Task<IActionResult> AddPowerSupply([FromBody] PowerSupply newPsu)
        {
            _context.PowerSupplies.Add(newPsu);
            await _context.SaveChangesAsync();
            OnItemAdded?.Invoke(newPsu.Name, "Блок живлення");
            return Ok(new ApiResponse<PowerSupply>(newPsu));
        }

        // --- Нові деталі ---

        [HttpGet("ssds")]
        public async Task<IActionResult> GetSsds() => Ok(new ApiResponse<List<Ssd>>(await _context.Ssds.ToListAsync()));

        [HttpPost("ssds")]
        public async Task<IActionResult> AddSsd([FromBody] Ssd newSsd)
        {
            _context.Ssds.Add(newSsd);
            await _context.SaveChangesAsync();
            OnItemAdded?.Invoke(newSsd.Name, "SSD");
            return Ok(new ApiResponse<Ssd>(newSsd));
        }

        [HttpGet("cases")]
        public async Task<IActionResult> GetCases() => Ok(new ApiResponse<List<PcCase>>(await _context.Cases.ToListAsync()));

        [HttpPost("cases")]
        public async Task<IActionResult> AddCase([FromBody] PcCase newCase)
        {
            _context.Cases.Add(newCase);
            await _context.SaveChangesAsync();
            OnItemAdded?.Invoke(newCase.Name, "Корпус");
            return Ok(new ApiResponse<PcCase>(newCase));
        }

        [HttpGet("coolers")]
        public async Task<IActionResult> GetCoolers() => Ok(new ApiResponse<List<Cooler>>(await _context.Coolers.ToListAsync()));

        [HttpPost("coolers")]
        public async Task<IActionResult> AddCooler([FromBody] Cooler newCooler)
        {
            _context.Coolers.Add(newCooler);
            await _context.SaveChangesAsync();
            OnItemAdded?.Invoke(newCooler.Name, "Охолодження");
            return Ok(new ApiResponse<Cooler>(newCooler));
        }

        [HttpGet("headsets")]
        public async Task<IActionResult> GetHeadsets() => Ok(new ApiResponse<List<Headset>>(await _context.Headsets.ToListAsync()));

        [HttpPost("headsets")]
        public async Task<IActionResult> AddHeadset([FromBody] Headset newHeadset)
        {
            _context.Headsets.Add(newHeadset);
            await _context.SaveChangesAsync();
            OnItemAdded?.Invoke(newHeadset.Name, "Гарнітура");
            return Ok(new ApiResponse<Headset>(newHeadset));
        }
    }
    
}
