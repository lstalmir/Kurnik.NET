using Kurnik.Hubs;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kurnik.Services
{
    public class LobbyInvitationSenderService : ILobbyInvitationSenderService
    {
        private readonly IHubContext<InvitationHub> _hubContext;

        public LobbyInvitationSenderService(IHubContext<InvitationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public void SendInvitationToLobby(string recipientId, LobbyInvitationMessage invitation)
        {
            _hubContext.Clients
                .User(recipientId)
                .SendAsync("HandleInvitation", invitation)
                .Wait();
        }
    }
}
