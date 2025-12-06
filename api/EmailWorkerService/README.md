# Email Worker Service

A background worker service that consumes email notification messages from RabbitMQ and sends them via SMTP using SendGrid.

## Features

- Consumes messages from RabbitMQ queue `email_queue`
- Deserializes JSON messages into `EmailNotification` objects
- Sends emails using MailKit and SendGrid SMTP
- Automatic message acknowledgment and error handling
- Configurable RabbitMQ and SMTP settings

## Configuration

Update `appsettings.json` with your settings:

### RabbitMQ Configuration
```json
"RabbitMQ": {
  "HostName": "localhost",
  "UserName": "guest",
  "Password": "guest",
  "QueueName": "email_queue"
}
```

### SMTP Configuration (SendGrid)
```json
"Smtp": {
  "Host": "smtp.sendgrid.net",
  "Port": 587,
  "UserName": "apikey",
  "Password": "YOUR_SENDGRID_API_KEY",
  "FromEmail": "noreply@topdownlearning.com"
}
```

## Email Message Format

Messages in the RabbitMQ queue should be JSON formatted:

```json
{
  "To": "recipient@example.com",
  "Subject": "Email Subject",
  "Body": "<html><body>Email body content</body></html>"
}
```

## Running the Service

### Development
```bash
cd api/EmailWorkerService
dotnet run
```

### Production
```bash
cd api/EmailWorkerService
dotnet publish -c Release
dotnet EmailWorkerService.dll
```

## Dependencies

- **RabbitMQ.Client** (v7.2.0) - RabbitMQ client library
- **MailKit** (v4.14.1) - Email sending library with SMTP support
- **Microsoft.Extensions.Hosting** (v10.0.0) - Background service hosting

## Model

### EmailNotification
```csharp
public class EmailNotification
{
    public string To { get; set; }
    public string Subject { get; set; }
    public string Body { get; set; }
}
```

## Error Handling

- Failed messages are logged and requeued for retry
- Invalid messages (deserialization failures) are rejected without requeue
- SMTP errors are logged and the message is requeued
- Connection failures are logged and cause the service to stop

## Logging

The service logs:
- Service startup and shutdown
- RabbitMQ connection status
- Message reception and processing
- Email sending success/failure
- Any errors encountered
