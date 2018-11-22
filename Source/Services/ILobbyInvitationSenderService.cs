using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kurnik.Services
{
    public interface ILobbyInvitationSenderService
    {
        void SendInvitationToLobby(string recipientId, LobbyInvitationMessage invitation);
    }
}
