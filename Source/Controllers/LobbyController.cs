using Kurnik.Models;
using Kurnik.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;

namespace Kurnik.Controllers
{
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
            return View(lobby);
        }

        [HttpPut]
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

        // consume with ajax when owner of the lobby removes user
        [HttpDelete]
        [Route("Lobby/{lobbyId}/User/{userId}")]
        public IActionResult RemoveUser(int lobbyId, string userId)
        {
            _service.RemoveUser(lobbyId, userId);
            return NoContent();
        }
    }
}