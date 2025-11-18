using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Models;
using API.DTOs;
using BCrypt.Net;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    // POST: api/Auth/Login
    [HttpPost("Login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        // Find candidate by email
        var candidate = await _context.Candidate
            .FirstOrDefaultAsync(c => c.Email == request.Email && !c.IsDeleted);

        if (candidate == null)
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        // Verify password
        if (string.IsNullOrEmpty(candidate.Userpassword) || 
            !BCrypt.Net.BCrypt.Verify(request.Password, candidate.Userpassword))
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        // Check if account is blocked
        if (candidate.IsBlocked)
        {
            return Unauthorized(new { message = "Account is blocked" });
        }

        // Generate JWT token
        var token = GenerateJwtToken(candidate);

        return Ok(new AuthResponse
        {
            Token = token,
            Email = candidate.Email,
            Firstname = candidate.Firstname,
            Lastname = candidate.Lastname,
            Id = candidate.Id
        });
    }

    // POST: api/Auth/Register
    [HttpPost("Register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        // Check if email already exists
        if (await _context.Candidate.AnyAsync(c => c.Email == request.Email))
        {
            return BadRequest(new { message = "Email already registered" });
        }

        // Check if phone already exists (if provided)
        if (!string.IsNullOrEmpty(request.Phone) && 
            await _context.Candidate.AnyAsync(c => c.Phone == request.Phone))
        {
            return BadRequest(new { message = "Phone number already registered" });
        }

        // Hash password using BCrypt
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

        // Create new candidate
        var candidate = new Candidate
        {
            Firstname = request.Firstname,
            Middlename = request.Middlename,
            Lastname = request.Lastname,
            Email = request.Email,
            Phone = request.Phone,
            Address = request.Address,
            City = request.City,
            State = request.State,
            Country = request.Country,
            Zip = request.Zip,
            Dob = request.Dob,
            Userpassword = hashedPassword,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            IsActive = true,
            IsDeleted = false,
            IsArchived = false,
            IsVerified = false,
            IsBlocked = false,
            CreatedBy = "System",
            UpdatedBy = "System",
            Status = "Registered"
        };

        _context.Candidate.Add(candidate);
        await _context.SaveChangesAsync();

        // Generate JWT token
        var token = GenerateJwtToken(candidate);

        return Ok(new AuthResponse
        {
            Token = token,
            Email = candidate.Email,
            Firstname = candidate.Firstname,
            Lastname = candidate.Lastname,
            Id = candidate.Id
        });
    }

    private string GenerateJwtToken(Candidate candidate)
    {
        var jwtKey = _configuration["Jwt:Key"];
        var jwtIssuer = _configuration["Jwt:Issuer"];
        var jwtAudience = _configuration["Jwt:Audience"];
        var jwtExpiryInMinutes = int.Parse(_configuration["Jwt:ExpiryInMinutes"] ?? "60");

        if (string.IsNullOrEmpty(jwtKey))
        {
            throw new InvalidOperationException("JWT Key is not configured");
        }

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, candidate.Email),
            new Claim(JwtRegisteredClaimNames.Email, candidate.Email),
            new Claim("id", candidate.Id.ToString()),
            new Claim("firstname", candidate.Firstname),
            new Claim("lastname", candidate.Lastname),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(jwtExpiryInMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
