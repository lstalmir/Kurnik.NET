using Kurnik.Areas.Identity.Data;
using System.Collections.Generic;

namespace Kurnik.Models
{
    public class UserParticipationInLobby
    {
        public int LobbyID { get; set; }
        public string UserID { get; set; }
        // User can mantain multiple connections i.e. use app from multiple devices/browser
        public ISet<string> ConnectionIds { get; set; } = new HashSet<string>();
        public virtual Lobby Lobby { get; set; }
        public virtual User User { get; set; }
    }
}
