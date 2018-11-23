using System;
using System.Threading.Tasks;
using Kurnik.Services;
using Microsoft.AspNetCore.SignalR;
using Source.Data;

namespace Kurnik.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ILobbyService _lobbyService;
        private readonly IUserService _userService;

        public ChatHub(ILobbyService lobbyService, IUserService userService)
        {
            _lobbyService = lobbyService;
            _userService = userService;
        }

        public async Task SendMessage(string message)
        {
            var username = Context.User.Identity.Name;
            var user = _userService.GetUserByUserName(username);
            if (user != null && user.LobbyParticipation != null)
            {
                var lobbyId = user.LobbyParticipation.LobbyID;
                await Clients.Group(lobbyId.ToString()).SendAsync("HandleMessage", username, message);
            }
        }

        public override async Task OnConnectedAsync()
        {
            var userName = Context.User.Identity.Name;
            var user = _userService.GetUserByUserName(userName);
            if(user.LobbyParticipation != null)
            {
                _lobbyService.SaveUserConnection(user.Id, Context.ConnectionId);
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var userName = Context.User.Identity.Name;
            var user = _userService.GetUserByUserName(userName);
            if (user.LobbyParticipation != null)
            {
                _lobbyService.RemoveUserConnection(user.Id, Context.ConnectionId);
            }
            await base.OnDisconnectedAsync(exception);
        }
    }
}
