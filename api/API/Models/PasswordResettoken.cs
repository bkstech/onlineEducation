using System;

namespace Api.Models;

public partial class PasswordResettoken
{
    public int Id { get; set; }

    public string? Email { get; set; }

    public string? Token { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime ExpiresAt { get; set; }
}
