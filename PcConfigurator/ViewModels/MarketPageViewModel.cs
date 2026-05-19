namespace PcConfigurator.ViewModels;

public class MarketPageViewModel
{
    public IReadOnlyList<ComponentCategory> Categories { get; }

    public MarketPageViewModel(IReadOnlyList<ComponentCategory> categories)
    {
        Categories = categories;
    }
}
