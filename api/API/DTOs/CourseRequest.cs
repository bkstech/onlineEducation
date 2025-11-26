using System;

namespace API.DTOs;

public class CourseRequest
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public decimal? Price { get; set; }
}
