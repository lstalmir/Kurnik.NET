using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kurnik.Models;
using Microsoft.AspNetCore.Mvc;
using Source.Data;

namespace Kurnik.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AccountController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        { 
            return View();
        }
    }
}