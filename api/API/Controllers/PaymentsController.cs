using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using API.DTOs;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly EstudydbContext _context;

    public PaymentsController(EstudydbContext context)
    {
        _context = context;
    }

    // POST: api/Payments
    [HttpPost]
    public async Task<ActionResult<Payment>> CreatePayment([FromBody] PaymentRequest request)
    {
        var enrollment = await _context.Enrollments.FindAsync(request.EnrollmentId);
        if (enrollment == null)
            return NotFound(new { message = "Enrollment not found." });

        var payment = new Payment
        {
            EnrollmentId = request.EnrollmentId,
            CandidateId = enrollment.CandidateId,
            CourseId = enrollment.CourseId,
            Amount = request.Amount,
            Status = "Pending",
            DueDate = request.DueDate,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPayment), new { id = payment.Id }, payment);
    }

    // GET: api/Payments/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Payment>> GetPayment(int id)
    {
        var payment = await _context.Payments.FindAsync(id);
        if (payment == null)
            return NotFound();
        return payment;
    }

    // GET: api/Payments/teacher/{teacherId}
    [HttpGet("teacher/{teacherId}")]
    public async Task<ActionResult<object>> GetPaymentsByTeacher(int teacherId, [FromQuery] string? status = null)
    {
        var query = _context.Payments
            .Join(_context.Courses,
                p => p.CourseId,
                c => c.Id,
                (p, c) => new { Payment = p, Course = c })
            .Where(x => x.Course.TeacherId == teacherId)
            .Join(_context.Candidates,
                x => x.Payment.CandidateId,
                c => c.Id,
                (x, c) => new
                {
                    x.Payment,
                    x.Course,
                    Candidate = c
                });

        if (status != null)
        {
            query = query.Where(x => x.Payment.Status == status);
        }

        var payments = await query
            .Select(x => new
            {
                PaymentId = x.Payment.Id,
                CourseId = x.Course.Id,
                CourseName = x.Course.Name,
                StudentId = x.Candidate.Id,
                StudentName = x.Candidate.Firstname + " " + x.Candidate.Lastname,
                StudentEmail = x.Candidate.Email,
                Amount = x.Payment.Amount,
                Status = x.Payment.Status,
                DueDate = x.Payment.DueDate,
                PaidDate = x.Payment.PaidDate,
                PaymentMethod = x.Payment.PaymentMethod,
                TransactionId = x.Payment.TransactionId
            })
            .OrderByDescending(x => x.DueDate)
            .ToListAsync();

        var totalPending = payments.Where(p => p.Status == "Pending").Sum(p => p.Amount);
        var totalReceived = payments.Where(p => p.Status == "Paid").Sum(p => p.Amount);

        return Ok(new
        {
            totalPayments = payments.Count,
            totalPending = totalPending,
            totalReceived = totalReceived,
            payments = payments
        });
    }

    // GET: api/Payments/course/{courseId}
    [HttpGet("course/{courseId}")]
    public async Task<ActionResult<IEnumerable<object>>> GetPaymentsByCourse(int courseId)
    {
        var payments = await _context.Payments
            .Where(p => p.CourseId == courseId)
            .Join(_context.Candidates,
                p => p.CandidateId,
                c => c.Id,
                (p, c) => new
                {
                    p.Id,
                    p.Amount,
                    p.Status,
                    p.DueDate,
                    p.PaidDate,
                    StudentName = c.Firstname + " " + c.Lastname,
                    StudentEmail = c.Email
                })
            .OrderByDescending(p => p.DueDate)
            .ToListAsync();

        return Ok(payments);
    }

    // PUT: api/Payments/{id}/mark-paid
    [HttpPut("{id}/mark-paid")]
    public async Task<ActionResult> MarkAsPaid(int id, [FromBody] MarkPaidRequest request)
    {
        var payment = await _context.Payments.FindAsync(id);
        if (payment == null)
            return NotFound();

        payment.Status = "Paid";
        payment.PaidDate = DateTime.UtcNow;
        payment.PaymentMethod = request.PaymentMethod;
        payment.TransactionId = request.TransactionId;
        payment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Payment marked as paid." });
    }
}

public class MarkPaidRequest
{
    public string? PaymentMethod { get; set; }
    public string? TransactionId { get; set; }
}
