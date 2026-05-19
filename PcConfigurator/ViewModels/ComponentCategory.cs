namespace PcConfigurator.ViewModels;

public class ComponentCategory
{
    public string Code { get; }
    public string ShortName { get; }
    public string FullName { get; }

    public ComponentCategory(string code, string shortName, string fullName)
    {
        Code = code;
        ShortName = shortName;
        FullName = fullName;
    }
}
