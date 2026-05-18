using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace PcConfigurator.Models
{
    // Базовий абстрактний клас для всіх комплектуючих (ООП: Наслідування)
    public abstract class HardwareItem
    {
        public int Id { get; set; }
        public required string Name { get; set; } 
        public decimal Price { get; set; }

        // Поліморфна властивість для фронтенду
        // [NotMapped] вказує Entity Framework не створювати під це поле колонку в таблиці БД
        [NotMapped] 
        public string TechnicalSpecs => GetTechnicalSpecs();

        protected HardwareItem(string name, decimal price)
        {
            Name = name;
            Price = price;
        }

        // Порожній конструктор необхідний для роботи Entity Framework
        protected HardwareItem() { }

        // Віртуальний метод для реалізації поліморфізму
        public virtual string GetTechnicalSpecs()
        {
            return "Нове комплектуюче з офіційного каталогу.";
        }
    }

    public class Cpu : HardwareItem
    {
        public required string Socket { get; set; }
        public int Cores { get; set; }

        public Cpu(string name, decimal price, string socket, int cores) 
            : base(name, price) 
        {
            Socket = socket;
            Cores = cores;
        }
        
        public Cpu() { }

        public override string GetTechnicalSpecs()
        {
            return $"Сокет: {Socket} | Ядра: {Cores}";
        }
    }

    public class Motherboard : HardwareItem
    {
        public required string Socket { get; set; }
        public required string RamType { get; set; }

        public override string GetTechnicalSpecs()
        {
            return $"Сокет: {Socket} | Пам'ять: {RamType}";
        }
    }

    public class Ram : HardwareItem
    {
        public required string RamType { get; set; }
        public int Capacity { get; set; }

        public override string GetTechnicalSpecs()
        {
            return $"Тип: {RamType} | Об'єм: {Capacity} GB";
        }
    }

    public class Gpu : HardwareItem
    {
        public int Vram { get; set; }
        public int RecommendedPsu { get; set; }

        public override string GetTechnicalSpecs()
        {
            return $"Відеопам'ять: {Vram} GB | Рекомендований БЖ: {RecommendedPsu}W";
        }
    }

    public class PowerSupply : HardwareItem
    {
        public int Wattage { get; set; }

        public override string GetTechnicalSpecs()
        {
            return $"Потужність: {Wattage}W";
        }
    }

    public class Ssd : HardwareItem
    {
        public int Capacity { get; set; }

        public override string GetTechnicalSpecs()
        {
            return $"Об'єм: {Capacity} GB";
        }
    }

    public class PcCase : HardwareItem
    {
        public required string FormFactor { get; set; }

        public override string GetTechnicalSpecs()
        {
            return $"Форм-фактор: {FormFactor}";
        }
    }

    public class Cooler : HardwareItem
    {
        public int Tdp { get; set; }

        public override string GetTechnicalSpecs()
        {
            return $"TDP: {Tdp}W";
        }
    }

    public class Headset : HardwareItem
    {
        public override string GetTechnicalSpecs()
        {
            return "Ігрова гарнітура з мікрофоном";
        }
    }

    // --- Моделі для оголошень та користувачів ---

    public class HardwareAd
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public decimal Price { get; set; }
        public required string ContactInfo { get; set; }
        public required string Category { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now; 
        public string? ImageBase64 { get; set; } 
        public required string OwnerUsername { get; set; }
    }

    public class User
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string Password { get; set; }
        public string Role { get; set; } = "User"; 
        public string? Token { get; set; }
    }

    public class LoginRequest
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
    }

    // Універсальна відповідь сервера (Generics)
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }

        public ApiResponse(T data, string message = "Успішно")
        {
            Success = true;
            Data = data;
            Message = message;
        }

        // ООП Паттерн "Фабричний метод" (Factory Method)
        public static ApiResponse<T> Error(string errorMessage)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = errorMessage,
                Data = default
            };
        }
        
        public ApiResponse() { }
    }
}