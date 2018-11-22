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

        public override bool Equals(object obj)
        {
            var lobby = obj as Lobby;
            return lobby != null &&
                   ID == lobby.ID &&
                   Name == lobby.Name &&
                   Private == lobby.Private &&
                   OwnerID == lobby.OwnerID &&
                   EqualityComparer<IList<UserParticipationInLobby>>.Default.Equals(UserParticipations, lobby.UserParticipations) &&
                   EqualityComparer<User>.Default.Equals(Owner, lobby.Owner);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(ID, Name, Private, OwnerID, UserParticipations, Owner);
        }
    }
}
