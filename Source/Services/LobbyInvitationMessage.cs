using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kurnik.Services
{
    public class LobbyInvitationMessage
    {
        public string InvitingUserName { get; set; }
        public int LobbyId { get; set; }
        public string LobbyName { get; set; }
    }
}
