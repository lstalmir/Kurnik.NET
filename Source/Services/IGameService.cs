using Kurnik.Areas.Identity.Data;
using Kurnik.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kurnik.Services
{
    public interface IGameService
    {
        Game AddGame( Lobby lobby, int width, int height );
        Game GetGame( int gameId );
        void RemoveGame( int gameId );
        GamePlayer AddPlayer( int gameId, User user, GamePlayerColor color );
        void RemovePlayer( string username );
    }
}
