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
            return View(_service.GetAllPublicOrOwnedLobbies(userId));
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(EditLobbyViewModel lobby)
        {
            try
            {
                _service.CreateLobby(userId, lobby.Name, lobby.Private);
            }
            catch (ArgumentOutOfRangeException ex1)
            {
                return NotFound(ex1);
            }
            return RedirectToAction("Index");
        }

        [HttpDelete]
        public IActionResult Delete(int id)
        {
            if (_service.IsUserOwnerOfTheLobby(id, userId))
            {
                return Forbid();
            }
            _service.RemoveLobby(id, userId);
            return RedirectToAction("Index");
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