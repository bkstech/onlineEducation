using EmailWorkerService;
using Serilog;
using Microsoft.Extensions.DependencyInjection;

// Configure Serilog for the worker
Log.Logger = new LoggerConfiguration()
	.Enrich.FromLogContext()
	.WriteTo.File("logs/email-worker-.log", rollingInterval: RollingInterval.Day)
	.CreateLogger();

var host = Host.CreateDefaultBuilder(args)
	.UseSerilog()
	.ConfigureServices(services =>
	{
		services.AddHostedService<EmailConsumerService>();
	})
	.Build();

host.Run();
