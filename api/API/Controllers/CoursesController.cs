using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using API.DTOs;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly EstudydbContext _context;

    public CoursesController(EstudydbContext context)
    {
        _context = context;
    }

    // GET: api/Courses
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Course>>> GetCourses()
    {
        return await _context.Courses.Where(c => !c.IsDeleted).ToListAsync();
    }

    // GET: api/Courses/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Course>> GetCourse(int id)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course == null || course.IsDeleted)
            return NotFound();
        return course;
    }

    // GET: api/Courses/teacher/{teacherId}
    [HttpGet("teacher/{teacherId}")]
    public async Task<ActionResult<IEnumerable<Course>>> GetCoursesByTeacher(int teacherId)
    {
        return await _context.Courses
            .Where(c => c.TeacherId == teacherId && !c.IsDeleted)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    // POST: api/Courses
    [HttpPost]
    public async Task<ActionResult<Course>> CreateCourse([FromBody] CourseRequest request, [FromQuery] int teacherId)
    {
        var course = new Course
        {
            TeacherId = teacherId,
            Name = request.Name,
            Description = request.Description,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Price = request.Price,
            Status = "Active",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            IsActive = true,
            IsDeleted = false
        };

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCourse), new { id = course.Id }, course);
    }

    // PUT: api/Courses/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCourse(int id, [FromBody] CourseRequest request)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course == null || course.IsDeleted)
            return NotFound();

        course.Name = request.Name;
        course.Description = request.Description;
        course.StartDate = request.StartDate;
        course.EndDate = request.EndDate;
        course.Price = request.Price;
        course.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/Courses/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCourse(int id)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course == null)
            return NotFound();

        course.IsDeleted = true;
        course.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
