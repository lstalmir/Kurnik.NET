using Kurnik.Areas.Identity.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kurnik.Services
{
    public interface IChatService
    {
        void AddConnectionToChat(string connectionId, string chatId);
        void OnUserJoined(string username, string chatId);
        void RemoveConnectionsFromChat(ICollection<string> connectionIds, string chatId);
        void OnUserLeft(string username, string chatId);
    }
}
