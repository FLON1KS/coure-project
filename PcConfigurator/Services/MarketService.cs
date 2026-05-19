using Microsoft.EntityFrameworkCore;
using PcConfigurator.Models;
using PcConfigurator.ViewModels;

namespace PcConfigurator.Services;

public class MarketService
{
    private readonly AppDbContext _context;
    private readonly ImageJsonService _imageJsonService;

    public MarketService(AppDbContext context, ImageJsonService imageJsonService)
    {
        _context = context;
        _imageJsonService = imageJsonService;
    }

    public async Task<MarketGridViewModel> GetGridAsync(
        string? category,
        decimal? minPrice,
        decimal? maxPrice,
        string? currentUser,
        string? currentRole)
    {
        var items = await GetAllMarketItemsAsync(currentUser, currentRole);
        string categoryCode = NormalizeCategory(category);

        var filtered = items
            .Where(i => categoryCode == "all" || i.Category == categoryCode)
            .Where(i => minPrice == null || i.Price >= minPrice)
            .Where(i => maxPrice == null || i.Price <= maxPrice)
            .ToList();

        return new MarketGridViewModel
        {
            Items = Shuffle(filtered)
        };
    }

    public async Task<PriceLimitsViewModel> GetPriceLimitsAsync(string? category)
    {
        var items = await GetAllMarketItemsAsync(null, null);
        string categoryCode = NormalizeCategory(category);

        var prices = items
            .Where(i => categoryCode == "all" || i.Category == categoryCode)
            .Select(i => i.Price)
            .ToList();

        if (prices.Count == 0)
        {
            return new PriceLimitsViewModel();
        }

        return new PriceLimitsViewModel
        {
            Min = prices.Min(),
            Max = prices.Max()
        };
    }

    public async Task<MarketItemViewModel?> GetDetailsAsync(string key, string? currentUser, string? currentRole)
    {
        var items = await GetAllMarketItemsAsync(currentUser, currentRole);
        return items.FirstOrDefault(i => i.Key == key);
    }

    private async Task<List<MarketItemViewModel>> GetAllMarketItemsAsync(string? currentUser, string? currentRole)
    {
        var result = new List<MarketItemViewModel>();

        AddHardwareItems(result, await _context.Cpus.ToListAsync());
        AddHardwareItems(result, await _context.Motherboards.ToListAsync());
        AddHardwareItems(result, await _context.Rams.ToListAsync());
        AddHardwareItems(result, await _context.Gpus.ToListAsync());
        AddHardwareItems(result, await _context.PowerSupplies.ToListAsync());
        AddHardwareItems(result, await _context.Ssds.ToListAsync());
        AddHardwareItems(result, await _context.Cases.ToListAsync());
        AddHardwareItems(result, await _context.Coolers.ToListAsync());
        AddHardwareItems(result, await _context.Headsets.ToListAsync());

        var ads = await _context.HardwareAds
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

        result.AddRange(ads.Select(ad => CreateAdItem(ad, currentUser, currentRole)));
        return result;
    }

    private void AddHardwareItems<T>(List<MarketItemViewModel> list, IEnumerable<T> items)
        where T : HardwareItem
    {
        foreach (var item in items)
        {
            list.Add(CreateHardwareItem(item));
        }
    }

    private MarketItemViewModel CreateHardwareItem(HardwareItem item)
    {
        var viewModel = new MarketItemViewModel
        {
            Id = item.Id,
            Key = $"{item.CategoryCode}-{item.Id}",
            Category = item.CategoryCode,
            CategoryLabel = ComponentCatalog.GetShortName(item.CategoryCode),
            Title = item.Name,
            Price = item.Price,
            Description = item.CatalogDescription,
            TechnicalSpecs = item.GetTechnicalSpecs(),
            IsAd = false,
            Socket = item.SocketInfo,
            RamType = item.RamTypeInfo,
            Capacity = item.CapacityInfo
        };

        return viewModel;
    }

    private MarketItemViewModel CreateAdItem(HardwareAd ad, string? currentUser, string? currentRole)
    {
        return new MarketItemViewModel
        {
            Id = ad.Id,
            Key = $"ad-{ad.Id}",
            Category = ad.Category,
            CategoryLabel = ComponentCatalog.GetShortName(ad.Category),
            Title = ad.Title,
            Price = ad.Price,
            Description = ad.Description,
            IsAd = true,
            OwnerUsername = ad.OwnerUsername,
            ContactInfo = ad.ContactInfo,
            CreatedAt = ad.CreatedAt,
            Images = _imageJsonService.ParseImages(ad.ImageBase64),
            CanEditDelete = CanEditAd(ad, currentUser, currentRole)
        };
    }

    private static bool CanEditAd(HardwareAd ad, string? currentUser, string? currentRole)
    {
        return currentRole == "Admin" || (!string.IsNullOrWhiteSpace(currentUser) && ad.OwnerUsername == currentUser);
    }

    private static string NormalizeCategory(string? category)
    {
        if (string.IsNullOrWhiteSpace(category) || category == "all")
        {
            return "all";
        }

        return ComponentCatalog.Exists(category) ? category : "all";
    }

    private static List<MarketItemViewModel> Shuffle(List<MarketItemViewModel> items)
    {
        return items
            .Select(item => new { Item = item, Order = Guid.NewGuid() })
            .OrderBy(x => x.Order)
            .Select(x => x.Item)
            .ToList();
    }
}
