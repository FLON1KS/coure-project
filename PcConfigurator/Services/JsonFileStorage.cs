using System.Text.Json;

namespace PcConfigurator.Services;

public class JsonFileStorage<T>
{
    private readonly string _filePath;
    private readonly JsonSerializerOptions _jsonOptions = new()
    {
        WriteIndented = true
    };

    public JsonFileStorage(string filePath)
    {
        _filePath = filePath;
    }

    public async Task<List<T>> ReadAllAsync()
    {
        try
        {
            if (!File.Exists(_filePath))
            {
                return new List<T>();
            }

            string json = await File.ReadAllTextAsync(_filePath);
            if (string.IsNullOrWhiteSpace(json))
            {
                return new List<T>();
            }

            return JsonSerializer.Deserialize<List<T>>(json) ?? new List<T>();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Помилка читання JSON-файлу: {ex.Message}");
            return new List<T>();
        }
    }

    public async Task AddAsync(T item)
    {
        var items = await ReadAllAsync();
        items.Add(item);
        await SaveAllAsync(items);
    }

    public async Task SaveAllAsync(IEnumerable<T> items)
    {
        try
        {
            string? folder = Path.GetDirectoryName(_filePath);
            if (!string.IsNullOrEmpty(folder))
            {
                Directory.CreateDirectory(folder);
            }

            string json = JsonSerializer.Serialize(items, _jsonOptions);
            await File.WriteAllTextAsync(_filePath, json);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Помилка запису JSON-файлу: {ex.Message}");
        }
    }
}
