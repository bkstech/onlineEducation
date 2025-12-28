using System;

namespace api.Models;

public partial class InvitedCandidate
{
    public int Id { get; set; }

    public int? TeacherId { get; set; }

    public string Email { get; set; } = null!;

    public DateTime CreatedAt { get; set; }
}
