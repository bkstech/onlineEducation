namespace API.DTOs;

public class RegisterRequest
{
    public string Firstname { get; set; } = null!;
    public string? Middlename { get; set; }
    public string Lastname { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? Phone { get; set; }
    public string Address { get; set; } = null!;
    public string City { get; set; } = null!;
    public string State { get; set; } = null!;
    public string Country { get; set; } = null!;
    public string Zip { get; set; } = null!;
    public DateTime Dob { get; set; }
    public string Password { get; set; } = null!;
}
