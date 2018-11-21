using Kurnik.Models;
using Kurnik.Services;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Kurnik.Controllers
{
    public class LobbyController : Controller
    {
        private readonly ILobbyService _service;

        public LobbyController(ILobbyService service)
        {
            _service = service;
        }

        public IActionResult Index()
        {
            var currentUserId = "not_implemented";
            return View(_service.GetAllPublicAndOwnedLobbies(currentUserId));
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(Lobby lobby)
        {
            // TODO get userId
            string ownerId = null;
            try
            {
                _service.CreateLobby(ownerId, lobby.Name, lobby.Private);
            }
            catch (ArgumentOutOfRangeException ex1)
            {
                return NotFound(ex1);
            }
            return RedirectToAction("Index");
        }

        [HttpDelete]
        public IActionResult Remove(int id)
        {
            _service.RemoveLobby(id);
            return RedirectToAction("Index");
        }

        public IActionResult Details(int id)
        {
            var lobby = _service.GetLobby(id);
            if (lobby == null)
            {
                return NotFound();
            }
            ViewData["title"] = "Pokój";
            return View(lobby);
        }

        [HttpPost]
        public IActionResult Join(int id)
        {
            // TODO get userId
            var userId = "not_implemented";
            try
            {
                _service.AddUser(id, userId);
            }
            catch (ArgumentOutOfRangeException ex1)
            {
                return NotFound(ex1);
            }
            return RedirectToAction("Details", id);
        }

        [HttpPost]
        public IActionResult Leave(int id)
        {
            // TODO get userId
            var userId = "not_implemented";
            _service.RemoveUser(id, userId);
            return RedirectToAction("Index");
        }

        // consume with ajax
        [HttpPut]
        public IActionResult Visibility(int id, [FromBody] LobbyVisibilityChange change)
        {
            try
            {
                _service.SetPrivate(id, change.Private);
            }
            catch (ArgumentOutOfRangeException ex)
            {
                return NotFound(ex.Message);
            }
            return Ok();
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