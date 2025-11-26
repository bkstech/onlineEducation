using System;

namespace api.Models;

public partial class Enrollment
{
    public int Id { get; set; }

    public int CourseId { get; set; }

    public int CandidateId { get; set; }

    public DateTime EnrolledDate { get; set; }

    public DateTime? CompletedDate { get; set; }

    public string Status { get; set; } = null!;

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
