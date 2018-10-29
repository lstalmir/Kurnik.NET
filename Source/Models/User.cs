using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Kurnik.Models
{
    public class User
    {
        public Guid Id { get; set; }

        [Required]
        public string Login { get; set; }

        public string Password { get; set; }
    }
}
