namespace PcConfigurator.Models;

public class Cpu : HardwareItem
{
    public override string CategoryCode => "cpu";
    public required string Socket { get; set; }
    public int Cores { get; set; }
    public override string? SocketInfo => Socket;

    public Cpu(string name, decimal price, string socket, int cores) : base(name, price)
    {
        Socket = socket;
        Cores = cores;
    }

    public Cpu()
    {
    }

    public override string GetTechnicalSpecs()
    {
        return $"Сокет: {Socket} | Ядра: {Cores}";
    }
}

public class Motherboard : HardwareItem
{
    public override string CategoryCode => "mb";
    public required string Socket { get; set; }
    public required string RamType { get; set; }
    public override string? SocketInfo => Socket;
    public override string? RamTypeInfo => RamType;

    public override string GetTechnicalSpecs()
    {
        return $"Сокет: {Socket} | Пам'ять: {RamType}";
    }
}

public class Ram : HardwareItem
{
    public override string CategoryCode => "ram";
    public required string RamType { get; set; }
    public int Capacity { get; set; }
    public override string? RamTypeInfo => RamType;
    public override int? CapacityInfo => Capacity;

    public override string GetTechnicalSpecs()
    {
        return $"Тип: {RamType} | Об'єм: {Capacity} GB";
    }
}

public class Gpu : HardwareItem
{
    public override string CategoryCode => "gpu";
    public int Vram { get; set; }
    public int RecommendedPsu { get; set; }

    public override string GetTechnicalSpecs()
    {
        return $"Відеопам'ять: {Vram} GB | Рекомендований БЖ: {RecommendedPsu}W";
    }
}

public class PowerSupply : HardwareItem
{
    public override string CategoryCode => "psu";
    public int Wattage { get; set; }

    public override string GetTechnicalSpecs()
    {
        return $"Потужність: {Wattage}W";
    }
}

public class Ssd : HardwareItem
{
    public override string CategoryCode => "ssd";
    public int Capacity { get; set; }
    public override int? CapacityInfo => Capacity;

    public override string GetTechnicalSpecs()
    {
        return $"Об'єм: {Capacity} GB";
    }
}

public class PcCase : HardwareItem
{
    public override string CategoryCode => "case";
    public required string FormFactor { get; set; }

    public override string GetTechnicalSpecs()
    {
        return $"Форм-фактор: {FormFactor}";
    }
}

public class Cooler : HardwareItem
{
    public override string CategoryCode => "cooler";
    public int Tdp { get; set; }

    public override string GetTechnicalSpecs()
    {
        return $"TDP: {Tdp}W";
    }
}

public class Headset : HardwareItem
{
    public override string CategoryCode => "headset";

    public override string GetTechnicalSpecs()
    {
        return "Ігрова гарнітура з мікрофоном";
    }
}
