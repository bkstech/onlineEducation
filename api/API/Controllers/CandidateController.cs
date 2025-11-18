using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using API.Models;

namespace CandidateApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CandidatesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CandidatesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Candidates
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Candidate>>> GetCandidates()
        {
            return await _context.Candidate.ToListAsync();
        }

        // GET: api/Candidates/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Candidate>> GetCandidate(int id)
        {
            var candidate = await _context.Candidate.FindAsync(id);
            if (candidate == null)
                return NotFound();
            return candidate;
        }

        // POST: api/Candidates
        [HttpPost]
        public async Task<ActionResult<Candidate>> PostCandidate(Candidate candidate)
        {
            candidate.Userpassword = HashPassword(candidate.Userpassword);
            _context.Candidate.Add(candidate);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCandidate), new { id = candidate.Id }, candidate);
        }

        // PUT: api/Candidates/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCandidate(int id, Candidate candidate)
        {
            if (id != candidate.Id)
                return BadRequest();
            candidate.Userpassword = HashPassword(candidate.Userpassword);
            _context.Entry(candidate).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Candidate.Any(e => e.Id == id))
                    return NotFound();
                else
                    throw;
            }
            return NoContent();
        }

        // DELETE: api/Candidates/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCandidate(int id)
        {
            var candidate = await _context.Candidate.FindAsync(id);
            if (candidate == null)
                return NotFound();
            _context.Candidate.Remove(candidate);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                var builder = new StringBuilder();
                foreach (var b in bytes)
                    builder.Append(b.ToString("x2"));
                return builder.ToString();
            }
        }
    }
}
