using Kurnik.Areas.Identity.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kurnik.Models
{
    public class LobbyViewModel
    {
        public IList<User> Users { get; set; }
        public Lobby Lobby { get; set; }
    }
}
