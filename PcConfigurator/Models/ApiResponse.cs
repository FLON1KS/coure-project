namespace PcConfigurator.Models;

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

    public static ApiResponse<T> Error(string errorMessage)
    {
        return new ApiResponse<T>
        {
            Success = false,
            Message = errorMessage,
            Data = default
        };
    }

    public ApiResponse()
    {
    }
}
