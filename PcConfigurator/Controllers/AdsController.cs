using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PcConfigurator.Models;
using PcConfigurator.Services;
using PcConfigurator.ViewModels;

namespace PcConfigurator.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdsController : ControllerBase
{
    private readonly AdsService _adsService;

    public AdsController(AdsService adsService)
    {
        _adsService = adsService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllAds()
    {
        var ads = await _adsService.GetAllAdsAsync();
        return Ok(new ApiResponse<List<HardwareAd>>(ads));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAdForEdit(int id)
    {
        var ad = await _adsService.GetEditorAsync(id);
        if (ad == null)
        {
            return NotFound(ApiResponse<object>.Error("Оголошення не знайдено."));
        }

        return Ok(new ApiResponse<AdEditorViewModel>(ad));
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateAd([FromBody] AdRequest request)
    {
        string owner = User.Identity?.Name ?? "Гість";
        var result = await _adsService.CreateAsync(request, owner);
        return ToActionResult(result);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAd(int id, [FromBody] AdRequest request)
    {
        var result = await _adsService.UpdateAsync(id, request, User.Identity?.Name, GetCurrentRole());
        return ToActionResult(result);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAd(int id)
    {
        var result = await _adsService.DeleteAsync(id, User.Identity?.Name, GetCurrentRole());
        return ToActionResult(result);
    }

    private string? GetCurrentRole()
    {
        return User.IsInRole("Admin") ? "Admin" : "User";
    }

    private IActionResult ToActionResult<T>(ServiceResult<T> result)
    {
        if (result.Success && result.Data != null)
        {
            return Ok(new ApiResponse<T>(result.Data, result.Message));
        }

        var error = ApiResponse<object>.Error(result.Message);

        return result.StatusCode switch
        {
            403 => StatusCode(403, error),
            404 => NotFound(error),
            _ => BadRequest(error)
        };
    }
}
