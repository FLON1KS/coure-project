using Microsoft.EntityFrameworkCore;
using PcConfigurator.Models;

namespace PcConfigurator.Services;

public delegate Task HardwareItemAddedHandler(HardwareItem item, string category);

public class HardwareCatalogService
{
    private readonly AppDbContext _context;

    public event HardwareItemAddedHandler? ItemAdded;

    public HardwareCatalogService(AppDbContext context, HardwareLogService logService)
    {
        _context = context;

        // Після додавання деталі записуємо короткий лог у JSON.
        ItemAdded += logService.WriteHardwareLogAsync;
    }

    public async Task<List<T>> GetAllAsync<T>() where T : HardwareItem
    {
        return await _context.Set<T>().ToListAsync();
    }

    public async Task<T> AddAsync<T>(T item) where T : HardwareItem
    {
        _context.Set<T>().Add(item);
        await _context.SaveChangesAsync();

        string category = ComponentCatalog.GetShortName(item.CategoryCode);
        await RaiseItemAddedAsync(item, category);
        return item;
    }

    private async Task RaiseItemAddedAsync(HardwareItem item, string category)
    {
        if (ItemAdded == null)
        {
            return;
        }

        foreach (HardwareItemAddedHandler handler in ItemAdded.GetInvocationList())
        {
            await handler(item, category);
        }
    }
}
