using Kurnik.Models;
using Source.Data;
using System;

namespace Kurnik.Services
{
    public class LobbyService : ILobbyService
    {
        private readonly ApplicationDbContext _dbContext;

        private void ThrowLobbyNotFoundException(int lobbyId)
        {
            throw new ArgumentOutOfRangeException(string.Format("Lobby with id {0} not found", lobbyId));
        }

        private void ThrowUserNotFoundException(string userId)
        {
            throw new ArgumentOutOfRangeException(string.Format("User with id {0} not found", userId));
        }

        public LobbyService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void SetPrivate(int lobbyId, bool isPrivate)
        {
            var lobby = _dbContext.Lobbies.Find(lobbyId);
            if(lobby == null)
            {
                ThrowLobbyNotFoundException(lobbyId);
            }
            lobby.Private = isPrivate;
            _dbContext.SaveChanges();
        }

        public Lobby GetLobby(int id)
        {
            return _dbContext.Lobbies.Find(id);
        }

        public void AddUser(int lobbyId, string userId)
        {
            var lobby = _dbContext.Lobbies.Find(lobbyId);
            if(lobby == null)
            {
                ThrowLobbyNotFoundException(lobbyId);
            }
            var user = _dbContext.Users.Find(userId);
            if(user == null)
            {
                ThrowUserNotFoundException(userId);
            }
            var alreadyExistingParticipation = _dbContext.UserParticipationInLobbies.Find(new object[] { lobbyId, userId});
            if (alreadyExistingParticipation != null)
            {
                throw new InvalidOperationException("User is already in the lobby");
            }
            var participation = _dbContext.UserParticipationInLobbies.Add(
                new UserParticipationInLobby()
                {
                    LobbyID = lobbyId,
                    UserID = userId
                }).Entity;
            user.LobbyParticipations.Add(participation);
            lobby.UserParticipations.Add(participation);
            _dbContext.SaveChanges();
        }

        public void RemoveUser(int lobbyId, string userId)
        {
            var participation = _dbContext.UserParticipationInLobbies.Find(new object[] { lobbyId, userId });
            if(participation != null)
            {
                _dbContext.UserParticipationInLobbies.Remove(participation);
                _dbContext.SaveChanges();
            }
        }

        public void InviteUser(int lobbyId, string userId)
        {
            throw new NotImplementedException();
        }
    }
}
