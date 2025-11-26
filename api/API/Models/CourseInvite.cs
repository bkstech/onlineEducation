using System;

namespace api.Models;

public partial class CourseInvite
{
    public int Id { get; set; }

    public int CourseId { get; set; }

    public int TeacherId { get; set; }

    public string CandidateEmail { get; set; } = null!;

    public int? CandidateId { get; set; }

    public string Status { get; set; } = null!;

    public string? InviteToken { get; set; }

    public DateTime? ExpiryDate { get; set; }

    public DateTime SentDate { get; set; }

    public DateTime? AcceptedDate { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
