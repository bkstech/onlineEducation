namespace API.DTOs;

public class ForgotPasswordRequest
{
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = "student";
}
