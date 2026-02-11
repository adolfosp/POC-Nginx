using POC_API_Error104.SignalR;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxConcurrentConnections = 100;
    options.Limits.MaxConcurrentUpgradedConnections = 100; // WebSockets
    options.Limits.KeepAliveTimeout = TimeSpan.FromSeconds(30);
    options.Limits.RequestHeadersTimeout = TimeSpan.FromSeconds(15);
});

// =========================
// Limitar ThreadPool (forçar exaustão)
// =========================
ThreadPool.SetMinThreads(4, 4);
ThreadPool.SetMaxThreads(8, 8);

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;
    options.KeepAliveInterval = TimeSpan.FromSeconds(15);
    options.ClientTimeoutInterval = TimeSpan.FromSeconds(30);
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        _ = policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .SetIsOriginAllowed(_ => true);
    });
});




WebApplication app = builder.Build();
object _locker = new();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    _ = app.MapOpenApi();
}
app.Use(async (context, next) =>
{
    if (context.Request.Path.StartsWithSegments("/hub/negotiate"))
    {
        Console.WriteLine("Abortando conexão agora");

        context.Abort(); // mata conexão durante negotiate
        return;
    }

    await next();
});

app.UseHttpsRedirection();

app.UseCors();

//app.UseAuthorization();

app.MapControllers();

app.MapHub<TestHub>("/hub");
app.MapGet("/lock", () =>
{
    lock (_locker)
    {
        Console.WriteLine("Entrou na seção crítica");

        Thread.Sleep(90000); // segura a thread por 10s

        Console.WriteLine("Saiu da seção crítica");

        return Results.Ok("Processado com lock");
    }
});

app.Run();
