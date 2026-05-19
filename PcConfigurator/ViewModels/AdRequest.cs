namespace PcConfigurator.ViewModels;

public class AdRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string ContactInfo { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> Images { get; set; } = new();
}

public class AdEditorViewModel : AdRequest
{
    public int Id { get; set; }
    public string? OwnerUsername { get; set; }
}
