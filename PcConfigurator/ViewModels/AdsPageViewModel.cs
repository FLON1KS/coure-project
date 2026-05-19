namespace PcConfigurator.ViewModels;

public class AdsPageViewModel
{
    public IReadOnlyList<ComponentCategory> Categories { get; }

    public AdsPageViewModel(IReadOnlyList<ComponentCategory> categories)
    {
        Categories = categories;
    }
}
