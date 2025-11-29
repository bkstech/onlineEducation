using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
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

        var addedCandidates = new List<int>();
        var invalidEmails = new List<string>();
        var duplicateEmails = new List<string>();

        foreach (var email in request.Emails)
        {
            // Validate email format
            if (string.IsNullOrWhiteSpace(email) || !EmailRegex.IsMatch(email))
            {
                invalidEmails.Add(email ?? "empty");
                continue;
            }

            // Check if email already exists in database
            if (await _context.Candidate.AnyAsync(c => c.Email == email))
            {
                duplicateEmails.Add(email);
                continue;
            }

            // Create a new candidate with only email and default values for required fields
            var candidate = new Candidate
            {
                Email = email,
                Firstname = "Pending",
                Lastname = "Pending",
                Address = "Pending",
                City = "Pending",
                State = "Pending",
                Country = "Pending",
                Zip = "00000",
                Dob = new DateTime(1900, 1, 1), // Use a clear placeholder date
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsActive = true,
                IsDeleted = false,
                IsArchived = false,
                IsVerified = false,
                IsBlocked = false,
                CreatedBy = "Teacher",
                UpdatedBy = "Teacher",
                Status = "Registered"
            };

            _context.Candidate.Add(candidate);
            await _context.SaveChangesAsync();

            // Get the inserted candidate Id (auto-generated identity column)
            var candidateId = candidate.Id;
            addedCandidates.Add(candidateId);

            // Create the teacher-candidate relationship
            var teacherCandidate = new Teachercandidate
            {
                TeacherId = request.TeacherId,
                CandidateId = candidateId
            };
            _context.Teachercandidates.Add(teacherCandidate);
        }

        await _context.SaveChangesAsync();
        
        var result = new
        {
            message = $"{addedCandidates.Count} candidate(s) added successfully.",
            candidateIds = addedCandidates,
            invalidEmails = invalidEmails.Count > 0 ? invalidEmails : null,
            duplicateEmails = duplicateEmails.Count > 0 ? duplicateEmails : null
        };

        return Ok(result);
    }
}
