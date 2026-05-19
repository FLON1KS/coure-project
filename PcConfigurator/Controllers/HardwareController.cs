using Microsoft.AspNetCore.Mvc;
using PcConfigurator.Models;
using PcConfigurator.Services;

namespace PcConfigurator.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HardwareController : ControllerBase
{
    private readonly HardwareCatalogService _catalogService;

    public HardwareController(HardwareCatalogService catalogService)
    {
        _catalogService = catalogService;
    }

    [HttpGet("cpus")]
    public async Task<IActionResult> GetCpus()
    {
        return Ok(new ApiResponse<List<Cpu>>(await _catalogService.GetAllAsync<Cpu>()));
    }

    [HttpPost("cpus")]
    public async Task<IActionResult> AddCpu([FromBody] Cpu newCpu)
    {
        var cpu = await _catalogService.AddAsync(newCpu);
        return Ok(new ApiResponse<Cpu>(cpu, "Процесор успішно додано до бази"));
    }

    [HttpGet("motherboards")]
    public async Task<IActionResult> GetMotherboards()
    {
        return Ok(new ApiResponse<List<Motherboard>>(await _catalogService.GetAllAsync<Motherboard>()));
    }

    [HttpPost("motherboards")]
    public async Task<IActionResult> AddMotherboard([FromBody] Motherboard newMotherboard)
    {
        var motherboard = await _catalogService.AddAsync(newMotherboard);
        return Ok(new ApiResponse<Motherboard>(motherboard, "Плату успішно додано"));
    }

    [HttpGet("rams")]
    public async Task<IActionResult> GetRams()
    {
        return Ok(new ApiResponse<List<Ram>>(await _catalogService.GetAllAsync<Ram>()));
    }

    [HttpPost("rams")]
    public async Task<IActionResult> AddRam([FromBody] Ram newRam)
    {
        var ram = await _catalogService.AddAsync(newRam);
        return Ok(new ApiResponse<Ram>(ram));
    }

    [HttpGet("gpus")]
    public async Task<IActionResult> GetGpus()
    {
        return Ok(new ApiResponse<List<Gpu>>(await _catalogService.GetAllAsync<Gpu>()));
    }

    [HttpPost("gpus")]
    public async Task<IActionResult> AddGpu([FromBody] Gpu newGpu)
    {
        var gpu = await _catalogService.AddAsync(newGpu);
        return Ok(new ApiResponse<Gpu>(gpu));
    }

    [HttpGet("powersupplies")]
    public async Task<IActionResult> GetPowerSupplies()
    {
        return Ok(new ApiResponse<List<PowerSupply>>(await _catalogService.GetAllAsync<PowerSupply>()));
    }

    [HttpPost("powersupplies")]
    public async Task<IActionResult> AddPowerSupply([FromBody] PowerSupply newPowerSupply)
    {
        var powerSupply = await _catalogService.AddAsync(newPowerSupply);
        return Ok(new ApiResponse<PowerSupply>(powerSupply));
    }

    [HttpGet("ssds")]
    public async Task<IActionResult> GetSsds()
    {
        return Ok(new ApiResponse<List<Ssd>>(await _catalogService.GetAllAsync<Ssd>()));
    }

    [HttpPost("ssds")]
    public async Task<IActionResult> AddSsd([FromBody] Ssd newSsd)
    {
        var ssd = await _catalogService.AddAsync(newSsd);
        return Ok(new ApiResponse<Ssd>(ssd));
    }

    [HttpGet("cases")]
    public async Task<IActionResult> GetCases()
    {
        return Ok(new ApiResponse<List<PcCase>>(await _catalogService.GetAllAsync<PcCase>()));
    }

    [HttpPost("cases")]
    public async Task<IActionResult> AddCase([FromBody] PcCase newCase)
    {
        var pcCase = await _catalogService.AddAsync(newCase);
        return Ok(new ApiResponse<PcCase>(pcCase));
    }

    [HttpGet("coolers")]
    public async Task<IActionResult> GetCoolers()
    {
        return Ok(new ApiResponse<List<Cooler>>(await _catalogService.GetAllAsync<Cooler>()));
    }

    [HttpPost("coolers")]
    public async Task<IActionResult> AddCooler([FromBody] Cooler newCooler)
    {
        var cooler = await _catalogService.AddAsync(newCooler);
        return Ok(new ApiResponse<Cooler>(cooler));
    }

    [HttpGet("headsets")]
    public async Task<IActionResult> GetHeadsets()
    {
        return Ok(new ApiResponse<List<Headset>>(await _catalogService.GetAllAsync<Headset>()));
    }

    [HttpPost("headsets")]
    public async Task<IActionResult> AddHeadset([FromBody] Headset newHeadset)
    {
        var headset = await _catalogService.AddAsync(newHeadset);
        return Ok(new ApiResponse<Headset>(headset));
    }
}
