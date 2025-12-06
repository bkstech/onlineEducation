using System.Text;
using System.Text.Json;
using EmailWorkerService.Models;
using MailKit.Net.Smtp;
using MimeKit;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace EmailWorkerService;

public class EmailConsumerService : BackgroundService
{
    private readonly ILogger<EmailConsumerService> _logger;
    private readonly IConfiguration _configuration;
    private IConnection? _connection;
    private IChannel? _channel;

    public EmailConsumerService(ILogger<EmailConsumerService> logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }

    public override async Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("EmailConsumerService is starting.");

        // Get RabbitMQ configuration
        var hostName = _configuration["RabbitMQ:HostName"] ?? "localhost";
        var userName = _configuration["RabbitMQ:UserName"] ?? "guest";
        var password = _configuration["RabbitMQ:Password"] ?? "guest";
        var queueName = _configuration["RabbitMQ:QueueName"] ?? "email_queue";

        // Create RabbitMQ connection
        var factory = new ConnectionFactory
        {
            HostName = hostName,
            UserName = userName,
            Password = password
        };

        try
        {
            _connection = await factory.CreateConnectionAsync(cancellationToken);
            _channel = await _connection.CreateChannelAsync(cancellationToken: cancellationToken);

            // Declare the queue
            await _channel.QueueDeclareAsync(
                queue: queueName,
                durable: true,
                exclusive: false,
                autoDelete: false,
                arguments: null,
                cancellationToken: cancellationToken);

            _logger.LogInformation("Successfully connected to RabbitMQ and declared queue: {QueueName}", queueName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to connect to RabbitMQ");
            throw;
        }

        await base.StartAsync(cancellationToken);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (_channel == null)
        {
            _logger.LogError("Channel is not initialized");
            return;
        }

        var queueName = _configuration["RabbitMQ:QueueName"] ?? "email_queue";

        _logger.LogInformation("EmailConsumerService is now listening for messages on queue: {QueueName}", queueName);

        // Create a consumer
        var consumer = new AsyncEventingBasicConsumer(_channel);

        consumer.ReceivedAsync += async (model, ea) =>
        {
            try
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);

                _logger.LogInformation("Received message: {Message}", message);

                // Deserialize the message to EmailNotification object
                var email = JsonSerializer.Deserialize<EmailNotification>(message);

                if (email != null)
                {
                    // Send the email
                    await SendEmail(email);

                    // Acknowledge the message
                    await _channel.BasicAckAsync(deliveryTag: ea.DeliveryTag, multiple: false);

                    _logger.LogInformation("Email sent successfully to: {To}", email.To);
                }
                else
                {
                    _logger.LogWarning("Failed to deserialize message");
                    // Reject the message
                    await _channel.BasicRejectAsync(deliveryTag: ea.DeliveryTag, requeue: false);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing message");
                // Reject the message and requeue it
                await _channel.BasicRejectAsync(deliveryTag: ea.DeliveryTag, requeue: true);
            }
        };

        // Start consuming
        await _channel.BasicConsumeAsync(
            queue: queueName,
            autoAck: false,
            consumer: consumer,
            cancellationToken: stoppingToken);

        // Keep the service running
        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(1000, stoppingToken);
        }
    }

    private async Task SendEmail(EmailNotification email)
    {
        var message = new MimeMessage();

        // From
        message.From.Add(new MailboxAddress("Top Down Learning", _configuration["Smtp:FromEmail"] ?? "noreply@topdownlearning.com"));

        // To
        message.To.Add(MailboxAddress.Parse(email.To));

        // Subject
        message.Subject = email.Subject;

        // Body
        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = email.Body
        };
        message.Body = bodyBuilder.ToMessageBody();

        // Send using SMTP
        using var client = new SmtpClient();

        try
        {
            var smtpHost = _configuration["Smtp:Host"] ?? "smtp.sendgrid.net";
            var smtpPortStr = _configuration["Smtp:Port"] ?? "587";
            var smtpPort = int.TryParse(smtpPortStr, out var port) ? port : 587;
            var smtpUserName = _configuration["Smtp:UserName"] ?? "apikey";
            var smtpPassword = _configuration["Smtp:Password"] ?? "";

            await client.ConnectAsync(smtpHost, smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(smtpUserName, smtpPassword);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            _logger.LogInformation("Email sent successfully via SMTP");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email via SMTP");
            throw;
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("EmailConsumerService is stopping.");

        if (_channel != null)
        {
            await _channel.CloseAsync(cancellationToken);
            _channel.Dispose();
        }

        if (_connection != null)
        {
            await _connection.CloseAsync(cancellationToken);
            _connection.Dispose();
        }

        await base.StopAsync(cancellationToken);
    }
}
