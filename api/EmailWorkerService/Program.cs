using EmailWorkerService;

var builder = Host.CreateApplicationBuilder(args);
builder.Services.AddHostedService<EmailConsumerService>();

var host = builder.Build();
host.Run();
