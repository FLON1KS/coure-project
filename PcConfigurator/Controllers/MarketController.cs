using Microsoft.AspNetCore.Mvc;
using PcConfigurator.Services;

namespace PcConfigurator.Controllers;

[Route("market")]
public class MarketController : Controller
{
    private readonly MarketService _marketService;

    public MarketController(MarketService marketService)
    {
        _marketService = marketService;
    }

    [HttpGet("grid")]
    public async Task<IActionResult> Grid(
        string? category,
        decimal? minPrice,
        decimal? maxPrice,
        string? userName,
        string? userRole)
    {
        var model = await _marketService.GetGridAsync(category, minPrice, maxPrice, userName, userRole);
        return PartialView("_MarketGrid", model);
    }

    [HttpGet("price-limits")]
    public async Task<IActionResult> PriceLimits(string? category)
    {
        var limits = await _marketService.GetPriceLimitsAsync(category);
        return Json(limits);
    }

    [HttpGet("details")]
    public async Task<IActionResult> Details(string key, string? userName, string? userRole)
    {
        var item = await _marketService.GetDetailsAsync(key, userName, userRole);
        if (item == null)
        {
            return NotFound("Товар не знайдено.");
        }

        return PartialView("_ItemDetails", item);
    }
}
