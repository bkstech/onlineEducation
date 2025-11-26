namespace API.DTOs;

public class TeacherCandidateEmailRequest
{
    public int TeacherId { get; set; }
    public List<string> Emails { get; set; } = new();
}
