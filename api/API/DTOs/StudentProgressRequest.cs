namespace API.DTOs;

public class StudentProgressRequest
{
    public int EnrollmentId { get; set; }
    public int TopicId { get; set; }
    public string Status { get; set; } = null!;
    public decimal? Score { get; set; }
    public string? Notes { get; set; }
}
