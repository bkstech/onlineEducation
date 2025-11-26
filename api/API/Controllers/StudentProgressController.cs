using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using API.DTOs;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentProgressController : ControllerBase
{
    private readonly EstudydbContext _context;

    public StudentProgressController(EstudydbContext context)
    {
        _context = context;
    }

    // POST: api/StudentProgress
    [HttpPost]
    public async Task<ActionResult<StudentProgress>> CreateProgress([FromBody] StudentProgressRequest request)
    {
        var enrollment = await _context.Enrollments.FindAsync(request.EnrollmentId);
        if (enrollment == null)
            return NotFound(new { message = "Enrollment not found." });

        var topic = await _context.Topics.FindAsync(request.TopicId);
        if (topic == null)
            return NotFound(new { message = "Topic not found." });

        var progress = new StudentProgress
        {
            EnrollmentId = request.EnrollmentId,
            CandidateId = enrollment.CandidateId,
            TopicId = request.TopicId,
            Status = request.Status,
            Score = request.Score,
            Notes = request.Notes,
            CompletedDate = request.Status == "Completed" ? DateTime.UtcNow : null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.StudentProgress.Add(progress);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProgress), new { id = progress.Id }, progress);
    }

    // GET: api/StudentProgress/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<StudentProgress>> GetProgress(int id)
    {
        var progress = await _context.StudentProgress.FindAsync(id);
        if (progress == null)
            return NotFound();
        return progress;
    }

    // GET: api/StudentProgress/enrollment/{enrollmentId}
    [HttpGet("enrollment/{enrollmentId}")]
    public async Task<ActionResult<IEnumerable<object>>> GetProgressByEnrollment(int enrollmentId)
    {
        var progress = await _context.StudentProgress
            .Where(sp => sp.EnrollmentId == enrollmentId)
            .Join(_context.Topics,
                sp => sp.TopicId,
                t => t.Id,
                (sp, t) => new
                {
                    sp.Id,
                    sp.TopicId,
                    TopicName = t.Name,
                    TopicDescription = t.Description,
                    sp.Status,
                    sp.Score,
                    sp.CompletedDate,
                    sp.Notes
                })
            .OrderBy(p => p.TopicId)
            .ToListAsync();

        return Ok(progress);
    }

    // GET: api/StudentProgress/teacher/{teacherId}/student/{candidateId}
    [HttpGet("teacher/{teacherId}/student/{candidateId}")]
    public async Task<ActionResult<object>> GetStudentPerformance(int teacherId, int candidateId)
    {
        var performance = await _context.StudentProgress
            .Where(sp => sp.CandidateId == candidateId)
            .Join(_context.Topics,
                sp => sp.TopicId,
                t => t.Id,
                (sp, t) => new { Progress = sp, Topic = t })
            .Join(_context.Courses,
                x => x.Topic.CourseId,
                c => c.Id,
                (x, c) => new { x.Progress, x.Topic, Course = c })
            .Where(x => x.Course.TeacherId == teacherId)
            .Select(x => new
            {
                ProgressId = x.Progress.Id,
                CourseId = x.Course.Id,
                CourseName = x.Course.Name,
                TopicId = x.Topic.Id,
                TopicName = x.Topic.Name,
                Status = x.Progress.Status,
                Score = x.Progress.Score,
                CompletedDate = x.Progress.CompletedDate,
                Notes = x.Progress.Notes
            })
            .OrderBy(x => x.CourseName)
            .ThenBy(x => x.TopicName)
            .ToListAsync();

        var totalTopics = performance.Count;
        var completedTopics = performance.Count(p => p.Status == "Completed");
        var scoresWithValue = performance.Where(p => p.Score.HasValue).ToList();
        var averageScore = scoresWithValue.Any() ? scoresWithValue.Average(p => p.Score) : null;

        return Ok(new
        {
            totalTopics = totalTopics,
            completedTopics = completedTopics,
            inProgressTopics = performance.Count(p => p.Status == "In Progress"),
            averageScore = averageScore,
            performance = performance
        });
    }

    // PUT: api/StudentProgress/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProgress(int id, [FromBody] StudentProgressRequest request)
    {
        var progress = await _context.StudentProgress.FindAsync(id);
        if (progress == null)
            return NotFound();

        progress.Status = request.Status;
        progress.Score = request.Score;
        progress.Notes = request.Notes;
        progress.CompletedDate = request.Status == "Completed" ? DateTime.UtcNow : progress.CompletedDate;
        progress.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }
}
