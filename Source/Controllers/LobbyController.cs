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
        private readonly string currentUserId;

        public LobbyController(ILobbyService service, IHttpContextAccessor httpContextAccessor)
        {
            _service = service;
            currentUserId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
        }

        public IActionResult Index()
        {
            return View(_service.GetAllPublicOrOwnedLobbies(currentUserId));
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
                _service.CreateLobby(currentUserId, lobby.Name, lobby.Private);
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
            if (_service.IsUserOwnerOfTheLobby(id, currentUserId))
            {
                return Forbid();
            }
            _service.RemoveLobby(id, currentUserId);
            return RedirectToAction("Index");
        }

        public IActionResult Details(int id)
        {
            var lobby = _service.GetLobby(id);
            if (lobby == null)
            {
                return NotFound();
            }
            var isUserParticipator = _service.IsUserParticipatorOfTheLobby(id, currentUserId);
            var isUserOwner = _service.IsUserOwnerOfTheLobby(id, currentUserId);
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
            if (_service.IsUserOwnerOfTheLobby(id, currentUserId))
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
            if (_service.IsUserOwnerOfTheLobby(id, currentUserId))
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
                _service.AddUser(id, currentUserId);
            }
            catch (ArgumentOutOfRangeException ex1)
            {
                return NotFound(ex1);
            }
            catch(InvalidOperationException ex2)
            {
                return Conflict(ex2);
            }
            return RedirectToAction("Details", new { id });
        }
		
		[HttpPost]
		public IActionResult AddLobby(string name, bool isPrivate){
			var lobby = _service.CreateLobby(currentUserId, name, isPrivate);
			ViewData["title"] = "Pokój";
            return View(lobby);
		}

        [HttpPost]
        public IActionResult Leave(int id)
        {
            try
            {
                _service.RemoveUser(id, currentUserId);
            }
            catch(InvalidOperationException ex)
            {
                return Conflict(ex);
            }
            return RedirectToAction("Index");
        }

        [HttpPost]
        public IActionResult Remove(int id, string userId)
        {
            try
            {
                if (_service.IsUserOwnerOfTheLobby(id, userId))
                {
                    return Forbid();
                }
                _service.RemoveUser(id, userId);
            }catch(ArgumentOutOfRangeException e1)
            {
                return NotFound(e1);
            }catch(InvalidOperationException e2)
            {
                return Conflict(e2);
            }
            return RedirectToAction("Details", new { id });
        }

        // consume with ajax call
        [HttpPost]
        [Route("/lobbies/{lobbyId}/invitations")]
        public IActionResult InviteUser(int lobbyId, [FromBody] string invitedUserId)
        {
            try
            {
                if (!_service.IsUserOwnerOfTheLobby(lobbyId, currentUserId))
                {
                    return Forbid();
                }
                _service.InviteUser(lobbyId, invitedUserId);
            }catch(ArgumentOutOfRangeException ex1)
            {
                return NotFound(ex1);
            }
            catch (InvalidOperationException ex2)
            {
                return Conflict(ex2);
            }
            return Ok();
        }
    }
}