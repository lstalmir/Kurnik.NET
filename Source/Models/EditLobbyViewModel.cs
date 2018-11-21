using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Kurnik.Models
{
    public class EditLobbyViewModel
    {
        [Required]
        [MaxLength(30)]
        public string Name { get; set; }

        public bool Private { get; set; }
    }
}
