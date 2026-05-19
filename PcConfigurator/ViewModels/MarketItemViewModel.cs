namespace PcConfigurator.ViewModels;

public class MarketItemViewModel
{
    public int Id { get; set; }
    public required string Key { get; set; }
    public required string Category { get; set; }
    public required string CategoryLabel { get; set; }
    public required string Title { get; set; }
    public decimal Price { get; set; }
    public string? Description { get; set; }
    public string? TechnicalSpecs { get; set; }
    public bool IsAd { get; set; }
    public string? OwnerUsername { get; set; }
    public string? ContactInfo { get; set; }
    public DateTime? CreatedAt { get; set; }
    public bool CanEditDelete { get; set; }

    public string? Socket { get; set; }
    public string? RamType { get; set; }
    public int? Capacity { get; set; }

    public List<string> Images { get; set; } = new();

    public string? FirstImage => Images.Count > 0 ? Images[0] : null;
}
