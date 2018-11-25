using Kurnik.Services;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kurnik.Hubs
{
    public class GameHub : Hub
    {
        public GameHub()
        {
        }

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync( Exception exception )
        {
            return base.OnDisconnectedAsync( exception );
        }
    }
}
