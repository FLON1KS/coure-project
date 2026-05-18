using Microsoft.EntityFrameworkCore;
using PcConfigurator.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Cpu> Cpus => Set<Cpu>();
    public DbSet<Motherboard> Motherboards => Set<Motherboard>();
    public DbSet<Ram> Rams => Set<Ram>();
    public DbSet<Gpu> Gpus => Set<Gpu>();
    public DbSet<PowerSupply> PowerSupplies => Set<PowerSupply>();

    public DbSet<HardwareAd> HardwareAds => Set<HardwareAd>();
    public DbSet<Ssd> Ssds => Set<Ssd>();
    public DbSet<PcCase> Cases => Set<PcCase>();
    public DbSet<Cooler> Coolers => Set<Cooler>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Headset> Headsets => Set<Headset>();
}