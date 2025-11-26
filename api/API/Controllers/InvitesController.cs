using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using API.DTOs;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InvitesController : ControllerBase
{
    private readonly EstudydbContext _context;

    public InvitesController(EstudydbContext context)
    {
        _context = context;
    }

    // POST: api/Invites
    [HttpPost]
    public async Task<ActionResult> SendInvites([FromBody] InviteRequest request, [FromQuery] int teacherId)
    {
        if (request.CandidateEmails == null || request.CandidateEmails.Count == 0)
            return BadRequest(new { message = "CandidateEmails array is required." });

        var course = await _context.Courses.FindAsync(request.CourseId);
        if (course == null || course.IsDeleted)
            return NotFound(new { message = "Course not found." });

        if (course.TeacherId != teacherId)
            return Forbid();

        var invites = new List<CourseInvite>();

        foreach (var email in request.CandidateEmails)
        {
            var candidate = await _context.Candidates
                .FirstOrDefaultAsync(c => c.Email == email);

            var invite = new CourseInvite
            {
                CourseId = request.CourseId,
                TeacherId = teacherId,
                CandidateEmail = email,
                CandidateId = candidate?.Id,
                Status = "Pending",
                InviteToken = Guid.NewGuid().ToString(),
                ExpiryDate = DateTime.UtcNow.AddDays(7),
                SentDate = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.CourseInvites.Add(invite);
            invites.Add(invite);
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "Invites sent successfully.", invites = invites.Count });
    }

    // GET: api/Invites/course/{courseId}
    [HttpGet("course/{courseId}")]
    public async Task<ActionResult<IEnumerable<CourseInvite>>> GetInvitesByCourse(int courseId)
    {
        return await _context.CourseInvites
            .Where(i => i.CourseId == courseId)
            .OrderByDescending(i => i.SentDate)
            .ToListAsync();
    }

    // GET: api/Invites/teacher/{teacherId}
    [HttpGet("teacher/{teacherId}")]
    public async Task<ActionResult<IEnumerable<CourseInvite>>> GetInvitesByTeacher(int teacherId)
    {
        return await _context.CourseInvites
            .Where(i => i.TeacherId == teacherId)
            .OrderByDescending(i => i.SentDate)
            .ToListAsync();
    }

    // POST: api/Invites/accept/{token}
    [HttpPost("accept/{token}")]
    public async Task<ActionResult> AcceptInvite(string token, [FromQuery] int candidateId)
    {
        var invite = await _context.CourseInvites
            .FirstOrDefaultAsync(i => i.InviteToken == token);

        if (invite == null)
            return NotFound(new { message = "Invite not found." });

        if (invite.Status != "Pending")
            return BadRequest(new { message = "Invite already processed." });

        if (invite.ExpiryDate.HasValue && invite.ExpiryDate < DateTime.UtcNow)
            return BadRequest(new { message = "Invite has expired." });

        var existingEnrollment = await _context.Enrollments
            .FirstOrDefaultAsync(e => e.CourseId == invite.CourseId && e.CandidateId == candidateId);

        if (existingEnrollment != null)
            return BadRequest(new { message = "Already enrolled in this course." });

        var enrollment = new Enrollment
        {
            CourseId = invite.CourseId,
            CandidateId = candidateId,
            EnrolledDate = DateTime.UtcNow,
            Status = "Active",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Enrollments.Add(enrollment);

        invite.Status = "Accepted";
        invite.AcceptedDate = DateTime.UtcNow;
        invite.CandidateId = candidateId;
        invite.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Invite accepted and enrolled successfully.", enrollmentId = enrollment.Id });
    }
}
