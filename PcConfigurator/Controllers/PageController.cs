using Microsoft.AspNetCore.Mvc;
using PcConfigurator.Services;
using PcConfigurator.ViewModels;

namespace PcConfigurator.Controllers;

public class PageController : Controller
{
    [HttpGet("")]
    [HttpGet("index.html")]
    public IActionResult Index()
    {
        return View(new MarketPageViewModel(ComponentCatalog.Categories));
    }

    [HttpGet("ads.html")]
    public IActionResult Ads()
    {
        return View(new AdsPageViewModel(ComponentCatalog.Categories));
    }

    [HttpGet("login.html")]
    public IActionResult Login()
    {
        return View();
    }
}
