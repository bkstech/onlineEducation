using System;
using System.Collections.Generic;

namespace Api.Models;

public partial class Candidate
{
    public int Id { get; set; }

    public string? Firstname { get; set; }

    public string? Middlename { get; set; }

    public string? Lastname { get; set; }

    public string Email { get; set; } = null!;

    public string? Phone { get; set; }

    public string? Address { get; set; }

    public string? City { get; set; }

    public string? State { get; set; }

    public string? Country { get; set; }

    public string? Zip { get; set; }

    public DateTime? Dob { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    public bool? IsActive { get; set; }

    public bool IsDeleted { get; set; }

    public bool IsArchived { get; set; }

    public bool IsVerified { get; set; }

    public bool IsBlocked { get; set; }

    public string CreatedBy { get; set; } = null!;

    public string UpdatedBy { get; set; } = null!;

    public string Status { get; set; } = null!;

    public string? Userpassword { get; set; }
}
