using Api.Models;
using Api.Notification.Controllers;
using Api.Notification.DTOs;
using API.DTOs;
using Microsoft.AspNetCore.Mvc;
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
    public async Task<IActionResult> AddCandidateEmails([FromBody] CandidateEmailRequest request)
    {
        if (request == null || request.Emails == null || request.Emails.Count == 0)
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

            var invited = new InvitedCandidate
            {
                TeacherId = request.TeacherId,
                Email = email,
                CreatedAt = DateTime.UtcNow
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

        var emailRequest = new EmailRequest
        {
            Subject = "You are invited!",
            Body = "You have been invited by a teacher. Please register to join.",
            To = "vishal_varshney@hotmail.com"
        };
        var notification = new NotificationControllers();
        notification.SendEmail(emailRequest);

        return Ok(result);
    }
}