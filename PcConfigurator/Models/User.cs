namespace PcConfigurator.Models;

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

public class LoginResult
{
    public required string Username { get; set; }
    public required string Role { get; set; }
    public required string Token { get; set; }
}
