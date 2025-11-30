using System;
using System.Collections.Generic;

namespace Api.Models;

/// <summary>
/// Invited candidate email address and teacherid of teacher of invited those candidates.
/// </summary>
public partial class Invitedcandidate
{
    public int Id { get; set; }

    public int? TeacherId { get; set; }

    public string? CandidateEmail { get; set; }
}
