using Kurnik.Areas.Identity.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kurnik.Services
{
    public interface IUserService
    {
        User GetUserByUserName(string username); 
    }
}
