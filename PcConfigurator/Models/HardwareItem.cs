using System.ComponentModel.DataAnnotations.Schema;

namespace PcConfigurator.Models;

public interface IMarketProduct
{
    string Name { get; set; }
    decimal Price { get; set; }
    string CategoryCode { get; }
    string CatalogDescription { get; }
    string GetTechnicalSpecs();
}

// Спільна основа для комплектуючих з каталогу.
public abstract class HardwareItem : IMarketProduct
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public decimal Price { get; set; }

    [NotMapped]
    public abstract string CategoryCode { get; }

    [NotMapped]
    public virtual string CatalogDescription => "Нове комплектуюче з офіційного каталогу.";

    [NotMapped]
    public string TechnicalSpecs => GetTechnicalSpecs();

    [NotMapped]
    public virtual string? SocketInfo => null;

    [NotMapped]
    public virtual string? RamTypeInfo => null;

    [NotMapped]
    public virtual int? CapacityInfo => null;

    protected HardwareItem(string name, decimal price)
    {
        Name = name;
        Price = price;
    }

    protected HardwareItem()
    {
    }

    public virtual string GetTechnicalSpecs()
    {
        return CatalogDescription;
    }
}
