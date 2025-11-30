using System;
using System.Collections.Generic;

namespace Api.Models;

public partial class Teachercandidate
{
    public int Id { get; set; }

    public int? TeacherId { get; set; }

    public int? CandidateId { get; set; }
}
