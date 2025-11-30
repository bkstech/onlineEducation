using Microsoft.AspNetCore.Mvc;
using api.Models;
using API.DTOs;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeacherCandidatesController : ControllerBase
{
    private readonly EstudydbContext _context;
    public TeacherCandidatesController(EstudydbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> AddTeacherCandidates([FromBody] TeacherCandidateRequest request)
    {
        if (request.CandidateIds == null || request.CandidateIds.Count == 0)
            return BadRequest(new { message = "CandidateIds array is required." });

        foreach (var candidateId in request.CandidateIds)
        {
            var teacherCandidate = new Teachercandidate
            {
                TeacherId = request.TeacherId,
                CandidateId = candidateId
            };
            _context.Teachercandidates.Add(teacherCandidate);
        }
        await _context.SaveChangesAsync();
        return Ok(new { message = "Records inserted successfully." });
    }

    [HttpPost("addcandidateemails")]
    public async Task<IActionResult> AddCandidateEmails([FromBody] CandidateEmailRequest request)
    {
        if (request == null)
            return BadRequest(new { message = "Request body is required." });

        if (request.Emails == null || request.Emails.Count == 0)
            return BadRequest(new { message = "Emails array is required." });

        // Validate email format
        var emailRegex = new System.Text.RegularExpressions.Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");
        foreach (var email in request.Emails)
        {
            if (string.IsNullOrWhiteSpace(email) || !emailRegex.IsMatch(email))
                return BadRequest(new { message = $"Invalid email format: {email}" });
        }

        var invitedCandidates = request.Emails.Select(email => new InvitedCandidate
        {
            TeacherId = request.TeacherId,
            Email = email
        }).ToList();

        _context.InvitedCandidates.AddRange(invitedCandidates);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Candidate emails invited successfully." });
    }
}
