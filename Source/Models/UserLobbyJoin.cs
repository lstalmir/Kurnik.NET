using Kurnik.Areas.Identity.Data;

namespace Kurnik.Models
{
    public class UserParticipationInLobby
    {
        public int LobbyID { get; set; }
        public string UserID { get; set; }

        public virtual Lobby Lobby { get; set; }
        public virtual User User { get; set; }
    }
}
