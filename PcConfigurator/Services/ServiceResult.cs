namespace PcConfigurator.Services;

public class ServiceResult<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public int StatusCode { get; set; } = 200;
    public T? Data { get; set; }

    public static ServiceResult<T> Ok(T data, string message = "Успішно")
    {
        return new ServiceResult<T>
        {
            Success = true,
            Message = message,
            Data = data
        };
    }

    public static ServiceResult<T> Fail(string message, int statusCode = 400)
    {
        return new ServiceResult<T>
        {
            Success = false,
            Message = message,
            StatusCode = statusCode
        };
    }
}
