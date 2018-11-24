using Kurnik.Areas.Identity.Data;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Kurnik.Models
{
    public class Lobby
    {
        public int ID { get; set; }
        [Display(Name = "Nazwa")]
        public string Name { get; set; }
        [Display(Name = "Prywatny")]
        public bool Private { get; set; }
        public string OwnerID { get; set; }
        public virtual IList<UserParticipationInLobby> UserParticipations { get; set; }
        public virtual User Owner{ get; set; }
    }
}
