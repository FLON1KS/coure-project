using System.Text.Json;

namespace PcConfigurator.Services;

public class ImageJsonService
{
    public List<string> ParseImages(string? imageBase64)
    {
        if (string.IsNullOrWhiteSpace(imageBase64))
        {
            return new List<string>();
        }

        try
        {
            var images = JsonSerializer.Deserialize<List<string>>(imageBase64);
            return images?.Where(i => !string.IsNullOrWhiteSpace(i)).ToList() ?? new List<string>();
        }
        catch (JsonException)
        {
            // Для старих записів, де була тільки одна фотографія.
            return new List<string> { imageBase64 };
        }
    }

    public string SerializeImages(IEnumerable<string> images)
    {
        var cleanImages = images
            .Where(i => !string.IsNullOrWhiteSpace(i))
            .ToList();

        return JsonSerializer.Serialize(cleanImages);
    }
}
