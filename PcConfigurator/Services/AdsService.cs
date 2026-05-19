using Microsoft.EntityFrameworkCore;
using PcConfigurator.Models;
using PcConfigurator.ViewModels;

namespace PcConfigurator.Services;

public class AdsService
{
    private readonly AppDbContext _context;
    private readonly ImageJsonService _imageJsonService;

    public AdsService(AppDbContext context, ImageJsonService imageJsonService)
    {
        _context = context;
        _imageJsonService = imageJsonService;
    }

    public async Task<List<HardwareAd>> GetAllAdsAsync()
    {
        return await _context.HardwareAds
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<AdsListViewModel> GetAdsListAsync(bool onlyMine, string? currentUser, string? currentRole)
    {
        var ads = await GetAllAdsAsync();

        if (onlyMine)
        {
            ads = string.IsNullOrWhiteSpace(currentUser)
                ? new List<HardwareAd>()
                : ads.Where(a => a.OwnerUsername == currentUser).ToList();
        }

        return new AdsListViewModel
        {
            Ads = ads.Select(ad => ToViewModel(ad, currentUser, currentRole)).ToList()
        };
    }

    public async Task<AdEditorViewModel?> GetEditorAsync(int id)
    {
        var ad = await _context.HardwareAds.FindAsync(id);
        if (ad == null)
        {
            return null;
        }

        return new AdEditorViewModel
        {
            Id = ad.Id,
            Title = ad.Title,
            Description = ad.Description,
            Price = ad.Price,
            ContactInfo = ad.ContactInfo,
            Category = ad.Category,
            Images = _imageJsonService.ParseImages(ad.ImageBase64),
            OwnerUsername = ad.OwnerUsername
        };
    }

    public async Task<ServiceResult<HardwareAd>> CreateAsync(AdRequest request, string ownerUsername)
    {
        var validationError = ValidateRequest(request);
        if (validationError != null)
        {
            return ServiceResult<HardwareAd>.Fail(validationError);
        }

        var ad = new HardwareAd
        {
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Price = request.Price,
            ContactInfo = request.ContactInfo.Trim(),
            Category = request.Category,
            ImageBase64 = _imageJsonService.SerializeImages(request.Images),
            OwnerUsername = ownerUsername,
            CreatedAt = DateTime.Now
        };

        _context.HardwareAds.Add(ad);
        await _context.SaveChangesAsync();

        return ServiceResult<HardwareAd>.Ok(ad, "Оголошення успішно створено");
    }

    public async Task<ServiceResult<HardwareAd>> UpdateAsync(
        int id,
        AdRequest request,
        string? currentUser,
        string? currentRole)
    {
        var ad = await _context.HardwareAds.FindAsync(id);
        if (ad == null)
        {
            return ServiceResult<HardwareAd>.Fail("Оголошення не знайдено.", 404);
        }

        if (!CanEdit(ad, currentUser, currentRole))
        {
            return ServiceResult<HardwareAd>.Fail("Ви можете редагувати лише власні оголошення.", 403);
        }

        var validationError = ValidateRequest(request);
        if (validationError != null)
        {
            return ServiceResult<HardwareAd>.Fail(validationError);
        }

        ad.Title = request.Title.Trim();
        ad.Description = request.Description.Trim();
        ad.Price = request.Price;
        ad.ContactInfo = request.ContactInfo.Trim();
        ad.Category = request.Category;
        ad.ImageBase64 = _imageJsonService.SerializeImages(request.Images);

        await _context.SaveChangesAsync();
        return ServiceResult<HardwareAd>.Ok(ad, "Оголошення успішно оновлено.");
    }

    public async Task<ServiceResult<HardwareAd>> DeleteAsync(int id, string? currentUser, string? currentRole)
    {
        var ad = await _context.HardwareAds.FindAsync(id);
        if (ad == null)
        {
            return ServiceResult<HardwareAd>.Fail("Оголошення не знайдено.", 404);
        }

        if (!CanEdit(ad, currentUser, currentRole))
        {
            return ServiceResult<HardwareAd>.Fail("Ви можете видаляти лише власні оголошення.", 403);
        }

        _context.HardwareAds.Remove(ad);
        await _context.SaveChangesAsync();
        return ServiceResult<HardwareAd>.Ok(ad, "Оголошення успішно видалено");
    }

    private MarketItemViewModel ToViewModel(HardwareAd ad, string? currentUser, string? currentRole)
    {
        return new MarketItemViewModel
        {
            Id = ad.Id,
            Key = $"ad-{ad.Id}",
            Category = ad.Category,
            CategoryLabel = ComponentCatalog.GetShortName(ad.Category),
            Title = ad.Title,
            Description = ad.Description,
            Price = ad.Price,
            IsAd = true,
            ContactInfo = ad.ContactInfo,
            OwnerUsername = ad.OwnerUsername,
            CreatedAt = ad.CreatedAt,
            Images = _imageJsonService.ParseImages(ad.ImageBase64),
            CanEditDelete = CanEdit(ad, currentUser, currentRole)
        };
    }

    private static bool CanEdit(HardwareAd ad, string? currentUser, string? currentRole)
    {
        return currentRole == "Admin" || (!string.IsNullOrWhiteSpace(currentUser) && ad.OwnerUsername == currentUser);
    }

    private static string? ValidateRequest(AdRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title) ||
            string.IsNullOrWhiteSpace(request.Description) ||
            string.IsNullOrWhiteSpace(request.ContactInfo))
        {
            return "Заповніть усі обов'язкові поля.";
        }

        if (request.Price <= 0)
        {
            return "Ціна повинна бути більшою за нуль.";
        }

        if (!ComponentCatalog.Exists(request.Category))
        {
            return "Невідома категорія товару.";
        }

        if (request.Images.Count == 0 || request.Images.All(string.IsNullOrWhiteSpace))
        {
            return "Оголошення повинно мати хоча б одну фотографію.";
        }

        return null;
    }
}
