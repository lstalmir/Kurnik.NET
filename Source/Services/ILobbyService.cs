using Kurnik.Models;

namespace Kurnik.Services
{
    public interface ILobbyService
    {
        Lobby GetLobby(int id);
        void EditLobby(int lobbyId, string name, bool isPrivate);
        void AddUser(int lobbyId, string userId);
        void RemoveUser(int lobbyId, string userId);
        void InviteUser(int lobbyId, string userId);
        bool IsUserOwnerOfTheLobby(int lobbyId, string userId);
        bool IsUserParticipatorOfTheLobby(int lobbyId, string userId);
    }
}
