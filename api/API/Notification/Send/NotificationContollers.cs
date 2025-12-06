using Microsoft.AspNetCore.Mvc;
using Api.Notification.DTOs;
using RabbitMQ.Client;
using System.Text;
using System.Text.Json;

namespace Api.Notification.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationControllers : ControllerBase
    {
        [HttpPost("email")]
        public IActionResult SendEmail([FromBody] EmailRequest request)
        {
            var factory = new ConnectionFactory
            {
                HostName = "localhost",     // RabbitMQ running locally
                UserName = "guest",
                Password = "guest"
            };

            using var connection = factory.CreateConnection();
            using var channel = connection.CreateModel();

            channel.QueueDeclare(
                queue: "email_queue",
                durable: true,
                exclusive: false,
                autoDelete: false,
                arguments: null);

            var json = JsonSerializer.Serialize(request);
            var body = Encoding.UTF8.GetBytes(json);

            channel.BasicPublish(
                exchange: "",
                routingKey: "email_queue",
                basicProperties: null,
                body: body);

            return Ok(new { Message = "Email queued successfully" });
        }
    }
}
