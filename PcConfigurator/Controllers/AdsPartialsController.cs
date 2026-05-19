using Microsoft.AspNetCore.Mvc;
using PcConfigurator.Services;

namespace PcConfigurator.Controllers;

[Route("ads-partials")]
public class AdsPartialsController : Controller
{
    private readonly AdsService _adsService;

    public AdsPartialsController(AdsService adsService)
    {
        _adsService = adsService;
    }

    [HttpGet("list")]
    public async Task<IActionResult> List(bool onlyMine, string? userName, string? userRole)
    {
        var model = await _adsService.GetAdsListAsync(onlyMine, userName, userRole);
        return PartialView("_AdsList", model);
    }
}
