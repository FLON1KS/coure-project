namespace PcConfigurator.Models;

public class HardwareAd
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public decimal Price { get; set; }
    public required string ContactInfo { get; set; }
    public required string Category { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    // Фото зберігаються як JSON-масив рядків Base64.
    public string? ImageBase64 { get; set; }

    public required string OwnerUsername { get; set; }
}
