using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Models;
using API.DTOs;
using System.Text.RegularExpressions;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeacherCandidatesController : ControllerBase
{
    private readonly EstudydbContext _context;
    private static readonly Regex EmailRegex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.Compiled);
    
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
    public async Task<IActionResult> AddCandidateEmails([FromBody] TeacherCandidateEmailRequest request)
    {
        if (request.Emails == null || request.Emails.Count == 0)
            return BadRequest(new { message = "Emails array is required." });

        var invitedCount = 0;
        var invalidEmails = new List<string>();
        foreach (var email in request.Emails)
        {
            // Validate email format
            if (string.IsNullOrWhiteSpace(email) || !EmailRegex.IsMatch(email))
            {
                invalidEmails.Add(email ?? "empty");
                continue;
            }
            var invited = new Invitedcandidate
            {
                TeacherId = request.TeacherId,
                CandidateEmail = email
            };
            _context.Invitedcandidates.Add(invited);
            invitedCount++;
        }
        await _context.SaveChangesAsync();
        var result = new
        {
            message = $"{invitedCount} invitation(s) saved successfully.",
            invalidEmails = invalidEmails.Count > 0 ? invalidEmails : null
        };
        return Ok(result);
    }
}
