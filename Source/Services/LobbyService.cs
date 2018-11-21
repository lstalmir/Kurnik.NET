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

        public Lobby CreateLobby(string ownerId, string name, bool isPrivate)
        {
            if (_dbContext.Lobbies.FirstOrDefault(lobby => lobby.Name == name) != null)
                throw new InvalidOperationException("Lobby with this name already exists!");

            var newLobby = _dbContext.Lobbies.Add(new Lobby() { Name = name, Private = isPrivate, OwnerID = ownerId }).Entity;
            _dbContext.SaveChanges();
            return newLobby;
        }

        public IList<Lobby> GetAllPublicAndOwnedLobbies(string userId)
        {
            return _dbContext.Lobbies.Where(
                lobby => !lobby.Private || lobby.OwnerID.Equals(userId)
                ).ToList();

        }

        public void RemoveLobby(int id, string userId)
        {
            var lobby = _dbContext.Lobbies.Find(new object[] { id });
            if (lobby == null)
            {
                ThrowLobbyNotFoundException(id);
            }
            if (lobby.OwnerID != userId)
            {
                throw new InvalidOperationException("You do not have permission to perform this operation");
            }
            _dbContext.Lobbies.Remove(lobby);
            _dbContext.SaveChanges();
        }
    }
}
