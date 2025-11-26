using System;

namespace api.Models;

public partial class StudentProgress
{
    public int Id { get; set; }

    public int EnrollmentId { get; set; }

    public int CandidateId { get; set; }

    public int TopicId { get; set; }

    public string Status { get; set; } = null!;

    public decimal? Score { get; set; }

    public DateTime? CompletedDate { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
