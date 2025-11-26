using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EnrollmentsController : ControllerBase
{
    private readonly EstudydbContext _context;

    public EnrollmentsController(EstudydbContext context)
    {
        _context = context;
    }

    // GET: api/Enrollments/course/{courseId}
    [HttpGet("course/{courseId}")]
    public async Task<ActionResult<IEnumerable<object>>> GetEnrollmentsByCourse(int courseId)
    {
        var enrollments = await _context.Enrollments
            .Where(e => e.CourseId == courseId)
            .Join(_context.Candidates,
                e => e.CandidateId,
                c => c.Id,
                (e, c) => new
                {
                    e.Id,
                    e.CourseId,
                    e.CandidateId,
                    CandidateFirstName = c.Firstname,
                    CandidateLastName = c.Lastname,
                    CandidateEmail = c.Email,
                    e.EnrolledDate,
                    e.CompletedDate,
                    e.Status,
                    e.IsActive
                })
            .OrderByDescending(e => e.EnrolledDate)
            .ToListAsync();

        return Ok(enrollments);
    }

    // GET: api/Enrollments/teacher/{teacherId}/students
    [HttpGet("teacher/{teacherId}/students")]
    public async Task<ActionResult<object>> GetStudentsByTeacher(int teacherId, [FromQuery] string? status = null)
    {
        var query = _context.Enrollments
            .Join(_context.Courses,
                e => e.CourseId,
                c => c.Id,
                (e, c) => new { Enrollment = e, Course = c })
            .Where(x => x.Course.TeacherId == teacherId)
            .Join(_context.Candidates,
                x => x.Enrollment.CandidateId,
                c => c.Id,
                (x, c) => new
                {
                    x.Enrollment,
                    x.Course,
                    Candidate = c
                });

        if (status != null)
        {
            query = query.Where(x => x.Enrollment.Status == status);
        }

        var students = await query
            .Select(x => new
            {
                EnrollmentId = x.Enrollment.Id,
                CourseId = x.Course.Id,
                CourseName = x.Course.Name,
                StudentId = x.Candidate.Id,
                StudentFirstName = x.Candidate.Firstname,
                StudentLastName = x.Candidate.Lastname,
                StudentEmail = x.Candidate.Email,
                EnrolledDate = x.Enrollment.EnrolledDate,
                CompletedDate = x.Enrollment.CompletedDate,
                Status = x.Enrollment.Status,
                IsActive = x.Enrollment.IsActive
            })
            .OrderByDescending(x => x.EnrolledDate)
            .ToListAsync();

        var activeStudents = students.Where(s => s.IsActive && s.Status == "Active").ToList();
        var inactiveStudents = students.Where(s => !s.IsActive || s.Status != "Active").ToList();

        return Ok(new
        {
            totalStudents = students.Count,
            activeStudents = activeStudents.Count,
            inactiveStudents = inactiveStudents.Count,
            students = students
        });
    }

    // GET: api/Enrollments/candidate/{candidateId}
    [HttpGet("candidate/{candidateId}")]
    public async Task<ActionResult<IEnumerable<object>>> GetEnrollmentsByCandidate(int candidateId)
    {
        var enrollments = await _context.Enrollments
            .Where(e => e.CandidateId == candidateId)
            .Join(_context.Courses,
                e => e.CourseId,
                c => c.Id,
                (e, c) => new
                {
                    e.Id,
                    e.CourseId,
                    CourseName = c.Name,
                    CourseDescription = c.Description,
                    TeacherId = c.TeacherId,
                    e.EnrolledDate,
                    e.CompletedDate,
                    e.Status,
                    e.IsActive
                })
            .OrderByDescending(e => e.EnrolledDate)
            .ToListAsync();

        return Ok(enrollments);
    }
}
