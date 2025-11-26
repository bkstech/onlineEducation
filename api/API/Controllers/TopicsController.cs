using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using API.DTOs;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TopicsController : ControllerBase
{
    private readonly EstudydbContext _context;

    public TopicsController(EstudydbContext context)
    {
        _context = context;
    }

    // POST: api/Topics
    [HttpPost]
    public async Task<ActionResult<Topic>> CreateTopic([FromBody] TopicRequest request)
    {
        var course = await _context.Courses.FindAsync(request.CourseId);
        if (course == null || course.IsDeleted)
            return NotFound(new { message = "Course not found." });

        var topic = new Topic
        {
            CourseId = request.CourseId,
            Name = request.Name,
            Description = request.Description,
            OrderIndex = request.OrderIndex,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Topics.Add(topic);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTopic), new { id = topic.Id }, topic);
    }

    // GET: api/Topics/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Topic>> GetTopic(int id)
    {
        var topic = await _context.Topics.FindAsync(id);
        if (topic == null)
            return NotFound();
        return topic;
    }

    // GET: api/Topics/course/{courseId}
    [HttpGet("course/{courseId}")]
    public async Task<ActionResult<IEnumerable<Topic>>> GetTopicsByCourse(int courseId)
    {
        return await _context.Topics
            .Where(t => t.CourseId == courseId && t.IsActive)
            .OrderBy(t => t.OrderIndex)
            .ToListAsync();
    }

    // GET: api/Topics/teacher/{teacherId}/student/{candidateId}
    [HttpGet("teacher/{teacherId}/student/{candidateId}")]
    public async Task<ActionResult<object>> GetTopicsTaughtToStudent(int teacherId, int candidateId)
    {
        var topicsTaught = await _context.StudentProgress
            .Join(_context.Topics,
                sp => sp.TopicId,
                t => t.Id,
                (sp, t) => new { Progress = sp, Topic = t })
            .Join(_context.Courses,
                x => x.Topic.CourseId,
                c => c.Id,
                (x, c) => new { x.Progress, x.Topic, Course = c })
            .Where(x => x.Course.TeacherId == teacherId && x.Progress.CandidateId == candidateId)
            .Select(x => new
            {
                TopicId = x.Topic.Id,
                TopicName = x.Topic.Name,
                TopicDescription = x.Topic.Description,
                CourseId = x.Course.Id,
                CourseName = x.Course.Name,
                Status = x.Progress.Status,
                Score = x.Progress.Score,
                CompletedDate = x.Progress.CompletedDate
            })
            .OrderBy(x => x.CourseName)
            .ThenBy(x => x.TopicId)
            .ToListAsync();

        return Ok(new
        {
            totalTopics = topicsTaught.Count,
            completedTopics = topicsTaught.Count(t => t.Status == "Completed"),
            topics = topicsTaught
        });
    }

    // PUT: api/Topics/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTopic(int id, [FromBody] TopicRequest request)
    {
        var topic = await _context.Topics.FindAsync(id);
        if (topic == null)
            return NotFound();

        topic.Name = request.Name;
        topic.Description = request.Description;
        topic.OrderIndex = request.OrderIndex;
        topic.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/Topics/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTopic(int id)
    {
        var topic = await _context.Topics.FindAsync(id);
        if (topic == null)
            return NotFound();

        topic.IsActive = false;
        topic.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
