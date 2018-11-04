using Kurnik.Models;

namespace Kurnik.Services
{
    public interface ILobbyService
    {
        Lobby GetLobby(int id);
        void SetPrivate(int lobbyId, bool isPrivate);
        void AddUser(int lobbyId, string userId);
        void RemoveUser(int lobbyId, string userId);
        void InviteUser(int lobbyId, string userId);
    }
}
