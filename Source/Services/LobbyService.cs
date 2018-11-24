using Kurnik.Areas.Identity.Data;
using Kurnik.Models;
using Source.Data;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Kurnik.Services
{
    public class LobbyService : ILobbyService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly ILobbyInvitationSenderService _lobbyInvitationSenderService;
        private readonly IChatService _chatService;

        private Lobby GetLobbyOrThrow(int lobbyId)
        {
            var lobby = _dbContext.Lobbies.Find(lobbyId);
            if(lobby == null)
            {
                throw new ArgumentOutOfRangeException(string.Format("Lobby with id {0} not found", lobbyId));
            }
            return lobby;
        }
        
        private User GetUserOrThrow(string userId)
        {
            var user = _dbContext.Users.Find(userId);
            if(user == null)
            {
                throw new ArgumentOutOfRangeException(string.Format("User with id {0} not found", userId));
            }
            return user;
        }

        public LobbyService(
            ApplicationDbContext dbContext,
            ILobbyInvitationSenderService lobbyInvitationSenderService,
            IChatService chatService)
        {
            _dbContext = dbContext;
            _lobbyInvitationSenderService = lobbyInvitationSenderService;
            _chatService = chatService;
        }

        public void EditLobby(int lobbyId, string name, bool isPrivate)
        {
            var lobby = GetLobbyOrThrow(lobbyId);
            lobby.Name = name;
            lobby.Private = isPrivate;
            _dbContext.SaveChanges();
        }

        public Lobby GetLobby(int id)
        {
            return _dbContext.Lobbies.Find(id);
        }
		
		public Lobby AddLobby(string name, bool isPrivate){
			var lobby = _dbContext.Lobbies.Add(
				new Lobby(){
					Name = name,
					Private = isPrivate
				}).Entity;
				_dbContext.SaveChanges();
		}

        public void AddUser(int lobbyId, string userId)
        {
            var lobby = GetLobbyOrThrow(lobbyId);
            var user = GetUserOrThrow(userId);
            if(user.LobbyParticipation != null)
            {
                throw new InvalidOperationException("User can participate in only one lobby at the same time");
            }
            var participation = _dbContext.UserParticipationInLobbies.Add(
                new UserParticipationInLobby()
                {
                    LobbyID = lobbyId,
                    UserID = userId
                }).Entity;
            _dbContext.SaveChanges();
        }

        public void SaveUserConnection(string userId, string connectionId)
        {
            var user = GetUserOrThrow(userId);
            if(user.LobbyParticipation == null)
            {
                throw new InvalidOperationException("User does not participate in any lobby");
            }
            user.LobbyParticipation.ConnectionIds.Add(connectionId);
            _dbContext.SaveChanges();
            var chatId = user.LobbyParticipation.LobbyID.ToString();
            _chatService.AddConnectionToChat(connectionId, chatId);
            if(user.LobbyParticipation.ConnectionIds.Count == 1)
            {
                _chatService.OnUserJoined(user.UserName, chatId);
            }
        }

        public void RemoveUserConnection(string userId, string connectionId)
        {
            var user = GetUserOrThrow(userId);
            if (user.LobbyParticipation == null)
            {
                throw new InvalidOperationException("User does not participate in any lobby");
            }
            user.LobbyParticipation.ConnectionIds.Remove(connectionId);
            _dbContext.SaveChanges();
            var chatId = user.LobbyParticipation.LobbyID.ToString();
            _chatService.RemoveConnectionsFromChat(new List<string> { connectionId }, chatId);
            if(user.LobbyParticipation.ConnectionIds.Count == 0)
            {
                _chatService.OnUserLeft(user.UserName, chatId);
            }
        }

        public bool IsUserOwnerOfTheLobby(int lobbyId, string userId)
        {
            var lobby = GetLobbyOrThrow(lobbyId);
            return lobby.OwnerId == userId;
        }

        public bool IsUserParticipatorOfTheLobby(int lobbyId, string userId)
        {
            return _dbContext.UserParticipationInLobbies.Find(new object[] { lobbyId, userId }) != null;
        }

        public void RemoveUser(int lobbyId, string userId)
        {
            var participation = _dbContext.UserParticipationInLobbies.Find(new object[] { lobbyId, userId });
            if (participation == null)
            {
                throw new InvalidOperationException(string.Format("User with id '{0} does not participate in the lobby", userId));
            }
            var user = participation.User;
            _dbContext.UserParticipationInLobbies.Remove(participation);
            _dbContext.SaveChanges();
            var chatId = participation.LobbyID.ToString();
            _chatService.RemoveConnectionsFromChat(participation.ConnectionIds, chatId);
            _chatService.OnUserLeft(user.UserName, chatId);
        }

        public void InviteUser(int lobbyId, string invitedUserId)
        {
            var invitedUser = GetUserOrThrow(invitedUserId);
            var lobby = GetLobbyOrThrow(lobbyId);
            var invitingUser = _dbContext.Users.Find(lobby.OwnerId);
            if (IsUserParticipatorOfTheLobby(lobbyId, invitedUserId))
            {
                throw new InvalidOperationException("User is already in the lobby");
            }
            var invitation = new LobbyInvitationMessage()
            {
                InvitingUserName = invitingUser.UserName,
                LobbyId = lobbyId,
                LobbyName = lobby.Name
            };
            _lobbyInvitationSenderService.SendInvitationToLobby(invitedUserId, invitation);
        }
    }
}
