using PcConfigurator.ViewModels;

namespace PcConfigurator.Services;

public static class ComponentCatalog
{
    private static readonly List<ComponentCategory> _categories = new()
    {
        new ComponentCategory("cpu", "Процесор", "Процесор"),
        new ComponentCategory("mb", "Мат. плата", "Материнська плата"),
        new ComponentCategory("ram", "ОЗУ", "Оперативна пам'ять"),
        new ComponentCategory("gpu", "Відеокарта", "Відеокарта"),
        new ComponentCategory("psu", "Блок живлення", "Блок живлення"),
        new ComponentCategory("ssd", "SSD", "SSD накопичувач"),
        new ComponentCategory("case", "Корпус", "Корпус"),
        new ComponentCategory("cooler", "Охолодження", "Охолодження"),
        new ComponentCategory("headset", "Гарнітура", "Гарнітура")
    };

    public static IReadOnlyList<ComponentCategory> Categories => _categories;

    public static string GetShortName(string? code)
    {
        return _categories.FirstOrDefault(c => c.Code == code)?.ShortName ?? "Товар";
    }

    public static bool Exists(string? code)
    {
        return _categories.Any(c => c.Code == code);
    }
}
