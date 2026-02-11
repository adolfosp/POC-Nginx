using Microsoft.AspNetCore.SignalR;

namespace POC_API_Error104.SignalR;

public class TestHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        Console.WriteLine("Conectado, aguardando...");

        // Espera o handshake terminar
        await Task.Delay(1000);



        await base.OnConnectedAsync();
    }
}

