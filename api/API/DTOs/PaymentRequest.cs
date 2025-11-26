namespace API.DTOs;

public class PaymentRequest
{
    public int EnrollmentId { get; set; }
    public decimal Amount { get; set; }
    public DateTime DueDate { get; set; }
}
