using PcConfigurator.Models;

namespace PcConfigurator.Services;

public class HardwareLogEntry
{
    public DateTime Time { get; set; }
    public string Item { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
}

public class HardwareLogService
{
    private readonly JsonFileStorage<HardwareLogEntry> _storage;

    public HardwareLogService(IWebHostEnvironment environment)
    {
        string filePath = Path.Combine(environment.ContentRootPath, "App_Data", "hardware-log.json");
        _storage = new JsonFileStorage<HardwareLogEntry>(filePath);
    }

    public async Task WriteHardwareLogAsync(HardwareItem item, string category)
    {
        var log = new HardwareLogEntry
        {
            Time = DateTime.Now,
            Item = item.Name,
            Category = category
        };

        await _storage.AddAsync(log);
    }
}
