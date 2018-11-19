using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Kurnik.Hubs
{
    public class ChatHub2 : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage2", user, message);
        }
    }
}
