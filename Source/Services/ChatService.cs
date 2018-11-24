using Kurnik.Areas.Identity.Data;
using Kurnik.Hubs;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kurnik.Services
{
    public class ChatService : IChatService
    {
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly static IDictionary<string, string> userIdToConnectionId = new ConcurrentDictionary<string, string>();

        public ChatService(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public void AddConnectionToChat(string connectionId, string chatId)
        {
            _hubContext.Groups
                .AddToGroupAsync(connectionId, chatId)
                .Wait();
        }

        public void OnUserJoined(string username, string chatId)
        {
            _hubContext.Clients
                .Group(chatId)
                .SendAsync("OnUserJoined", username)
                .Wait();
        }

        public void RemoveConnectionsFromChat(ICollection<string> connectionIds, string chatId)
        {
            foreach(string id in connectionIds)
            {
                _hubContext.Groups.RemoveFromGroupAsync(id, chatId);
            }
        }

        public void OnUserLeft(string username, string chatId)
        {
            _hubContext.Clients
                .Group(chatId)
                .SendAsync("OnUserLeft", username)
                .Wait();
        }
    }
}
