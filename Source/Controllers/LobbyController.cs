using Kurnik.Models;
using Kurnik.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;

namespace Kurnik.Controllers
{
    [Authorize]
    public class LobbyController : Controller
    {
        private readonly ILobbyService _service;
        private readonly string userId;

        public LobbyController(ILobbyService service, IHttpContextAccessor httpContextAccessor)
        {
            _service = service;
            userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
        }

        public IActionResult Index()
        {
            // TODO list lobbies
            return View();
        }
        public IActionResult Details(int id)
        {
            var lobby = _service.GetLobby(id);
            if (lobby == null)
            {
                return NotFound();
            }
            var isUserParticipator = _service.IsUserParticipatorOfTheLobby(id, userId);
            var isUserOwner = _service.IsUserOwnerOfTheLobby(id, userId);
            ViewBag.isOwner = isUserOwner;
            ViewBag.isParticipator = isUserParticipator;
            return View(lobby);
        }

        public IActionResult Edit(int id)
        {
            var lobby = _service.GetLobby(id);
            if(lobby == null)
            {
                return NotFound();
            }
            if (_service.IsUserOwnerOfTheLobby(id, userId))
            {
                return Forbid();
            }
            var viewModel = new EditLobbyViewModel()
            {
                Name = lobby.Name,
                Private = lobby.Private
            };
            return View(viewModel);
        }

        [HttpPost]
        public IActionResult Edit(int id, EditLobbyViewModel viewModel)
        {
            if (_service.IsUserOwnerOfTheLobby(id, userId))
            {
                return Forbid();
            }
            _service.EditLobby(id, viewModel.Name, viewModel.Private);
            return RedirectToAction("Details", new { id });
        }

        [HttpPost]
        public IActionResult Join(int id)
        {
            try
            {
                _service.AddUser(id, userId);
            }
            catch (ArgumentOutOfRangeException ex1)
            {
                return NotFound(ex1);
            }
            return RedirectToAction("Details", new { id });
        }

        [HttpPost]
        public IActionResult Leave(int id)
        {
            _service.RemoveUser(id, userId);
            return RedirectToAction("Index");
        }

        [HttpPost]
        public IActionResult Remove(int id, string userId)
        {
            if (_service.IsUserOwnerOfTheLobby(id, userId))
            {
                return Forbid();
            }
            _service.RemoveUser(id, userId);
            return RedirectToAction("Details", new { id });
        }
    }
}