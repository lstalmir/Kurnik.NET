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
        private readonly ILobbyService _lobbyService;
        private readonly IGameService _gameService;
        private readonly string currentUserId;

        public LobbyController(ILobbyService lobbyService, IGameService gameService, IHttpContextAccessor httpContextAccessor)
        {
            _lobbyService = lobbyService;
            _gameService = gameService;
            currentUserId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
        }

        public IActionResult Index()
        {
            return View(_lobbyService.GetAllPublicOrOwnedLobbies(currentUserId));
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
                _lobbyService.CreateLobby(currentUserId, lobby.Name, lobby.Private);
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
            if (_lobbyService.IsUserOwnerOfTheLobby(id, currentUserId))
            {
                return Forbid();
            }
            _lobbyService.RemoveLobby(id, currentUserId);
            return RedirectToAction("Index");
        }

        public IActionResult Details(int id)
        {
            var lobby = _lobbyService.GetLobby(id);
            if (lobby == null)
            {
                return NotFound();
            }
            var isUserParticipator = _lobbyService.IsUserParticipatorOfTheLobby(id, currentUserId);
            var isUserOwner = _lobbyService.IsUserOwnerOfTheLobby(id, currentUserId);
            ViewBag.isOwner = isUserOwner;
            ViewBag.isParticipator = isUserParticipator;
            return View(lobby);
        }

        public IActionResult Edit(int id)
        {
            var lobby = _lobbyService.GetLobby(id);
            if(lobby == null)
            {
                return NotFound();
            }
            if (_lobbyService.IsUserOwnerOfTheLobby(id, currentUserId))
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
            if (_lobbyService.IsUserOwnerOfTheLobby(id, currentUserId))
            {
                return Forbid();
            }
            _lobbyService.EditLobby(id, viewModel.Name, viewModel.Private);
            return RedirectToAction("Details", new { id });
        }

        [HttpPost]
        public IActionResult Join(int id)
        {
            try
            {
                _lobbyService.AddUser(id, currentUserId);
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
			var lobby = _lobbyService.CreateLobby(currentUserId, name, isPrivate);
			ViewData["title"] = "Pokój";
            return View(lobby);
		}

        [HttpPost]
        public IActionResult Leave(int id)
        {
            try
            {
                _lobbyService.RemoveUser(id, currentUserId);
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
                if (_lobbyService.IsUserOwnerOfTheLobby(id, userId))
                {
                    return Forbid();
                }
                _lobbyService.RemoveUser(id, userId);
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
                if (!_lobbyService.IsUserOwnerOfTheLobby(lobbyId, currentUserId))
                {
                    return Forbid();
                }
                _lobbyService.InviteUser(lobbyId, invitedUserId);
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

        [HttpPost]
        public IActionResult BeginGame( int lobbyId,
            [FromForm( Name = "GameWidth" )] int width,
            [FromForm( Name = "GameHeight" )] int height )
        {
            try
            {
                if( !_lobbyService.IsUserOwnerOfTheLobby( lobbyId, currentUserId ) )
                    return Forbid();

                _gameService.AddGame( _lobbyService.GetLobby( lobbyId ), width, height );
            }
            catch( ArgumentOutOfRangeException e ) { return NotFound( e ); }
            catch( InvalidOperationException e ) { return Conflict( e ); }
            catch( ArgumentException ) { return ValidationProblem(); }
            return RedirectToAction( "Game", lobbyId );
        }
        
        public IActionResult Game( int lobbyId )
        {
            return View();
        }
    }
}
