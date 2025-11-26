using System;

namespace api.Models;

public partial class Payment
{
    public int Id { get; set; }

    public int EnrollmentId { get; set; }

    public int CandidateId { get; set; }

    public int CourseId { get; set; }

    public decimal Amount { get; set; }

    public string Status { get; set; } = null!;

    public DateTime? PaidDate { get; set; }

    public DateTime DueDate { get; set; }

    public string? PaymentMethod { get; set; }

    public string? TransactionId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
