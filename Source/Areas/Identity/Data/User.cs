using Kurnik.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Kurnik.Areas.Identity.Data
{
    public class User : IdentityUser
    {
        public IList<UserParticipationInLobby> LobbyParticipations { get; set; }
    }
}
