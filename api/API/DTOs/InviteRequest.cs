namespace API.DTOs;

public class InviteRequest
{
    public int CourseId { get; set; }
    public List<string> CandidateEmails { get; set; } = new();
}
