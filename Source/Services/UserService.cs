using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kurnik.Areas.Identity.Data;
using Source.Data;

namespace Kurnik.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _dbContext;

        public UserService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public User GetUserByUserName(string username)
        {
            return _dbContext.Users.Where(user => user.UserName == username).First();
        }
    }
}
