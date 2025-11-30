namespace API.DTOs;

public class CandidateEmailRequest
{
    public int TeacherId { get; set; }
    public List<string> Emails { get; set; } = new();
}
