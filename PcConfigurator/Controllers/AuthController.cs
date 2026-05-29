using Microsoft.AspNetCore.Mvc;
using PcConfigurator.Models;
using PcConfigurator.Services;

namespace PcConfigurator.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);
        if (!result.Success || result.Data == null)
        {
            return Ok(ApiResponse<object>.Error(result.Message));
        }

        return Ok(new ApiResponse<LoginResult>(result.Data, result.Message));
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await _authService.RegisterAsync(request);
        if (!result.Success || result.Data == null)
        {
            return Ok(ApiResponse<object>.Error(result.Message));
        }

        return Ok(new ApiResponse<RegisterResult>(result.Data, result.Message));
    }
}
