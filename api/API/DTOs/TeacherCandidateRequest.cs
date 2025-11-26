namespace API.DTOs;

public class TeacherCandidateRequest
{
    public int TeacherId { get; set; }
    public List<int> CandidateIds { get; set; } = new();
}
