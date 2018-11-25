using Kurnik.Areas.Identity.Data;
using Kurnik.Hubs;
using Kurnik.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kurnik.Services
{
    public class GameService : IGameService
    {
        protected IUserService _userService;
        protected IHubContext<GameHub> _hubContext;
        // We use the lobby keys here.
        protected IDictionary<int, Game> _games;

        // ---------------------------------------------------------------------------------------
        /// <summary>
        /// 
        /// </summary>
        /// <param name="hubContext"></param>
        /// <param name="userService"></param>
        // ---------------------------------------------------------------------------------------
        public GameService( IHubContext<GameHub> hubContext, IUserService userService )
        {
            _hubContext = hubContext;
            _userService = userService;
        }

        // ---------------------------------------------------------------------------------------
        /// <summary>
        ///     Register a new game.
        /// </summary>
        /// <param name="lobby">
        ///     Lobby from which the game was created. If the lobby has already created
        ///     a game, an <see cref="InvalidOperationException"/> is thrown.
        /// </param>
        /// <param name="width">
        ///     Width of the game, in blocks. The game must be at least 5 blocks wide.
        ///     If the provided value is incorrect, <see cref="ArgumentException"/> is thrown.
        /// </param>
        /// <param name="height">
        ///     Height of the game, in blocks. The game must be at least 5 blocks wide.
        ///     If the provided value is incorrect, <see cref="ArgumentException"/> is thrown.
        /// </param>
        /// <returns>Newly created game.</returns>
        /// <exception cref="InvalidOperationException"></exception>
        /// <exception cref="ArgumentException"></exception>
        /// <exception cref="ArgumentNullException"></exception>
        // ---------------------------------------------------------------------------------------
        public Game AddGame( Lobby lobby, int width, int height )
        {
            if( _games.ContainsKey( lobby.ID ) )
                throw new InvalidOperationException( "Each lobby may run only one instance of the game at a time." );
            if( width < 5 || height < 5 )
                throw new ArgumentException( "Game must be at least 5 blocks wide in each dimension." );
            if( lobby == null )
                throw new ArgumentNullException( "Lobby must not be null." );

            var game = new Game( lobby, width, height );

            _games.Add( game.ID, game );

            // TODO: Broadcast message that the game has begun to the group
            //  The front should provide a link to the game view in such case.
            return game;
        }

        // ---------------------------------------------------------------------------------------
        /// <summary>
        /// 
        /// </summary>
        /// <param name="gameId"></param>
        /// <returns></returns>
        /// <exception cref="ArgumentOutOfRangeException"></exception>
        // ---------------------------------------------------------------------------------------
        public Game GetGame( int gameId )
        {
            if( !_games.ContainsKey( gameId ) )
                throw new ArgumentOutOfRangeException( "Game with specified id not found." );

            return _games[gameId];
        }

        // ---------------------------------------------------------------------------------------
        /// <summary>
        /// 
        /// </summary>
        /// <param name="gameId"></param>
        /// <exception cref="ArgumentOutOfRangeException"></exception>
        // ---------------------------------------------------------------------------------------
        public void RemoveGame( int gameId )
        {
            if( !_games.ContainsKey( gameId ) )
                throw new ArgumentOutOfRangeException( "Game with specified id not found." );

            _games.Remove( gameId );
        }

        // ---------------------------------------------------------------------------------------
        /// <summary>
        /// 
        /// </summary>
        /// <param name="username"></param>
        /// <param name="gameId"></param>
        /// <exception cref="ArgumentOutOfRangeException"></exception>
        // ---------------------------------------------------------------------------------------
        public GamePlayer AddPlayer( int gameId, User user, GamePlayerColor color )
        {
            var game = GetGame( gameId );

            var player = new GamePlayer( game )
            {
                User = user,
                IsAlive = true,
                Color = color
            };

            return player;
        }

        // ---------------------------------------------------------------------------------------
        /// <summary>
        /// 
        /// </summary>
        /// <param name="username"></param>
        // ---------------------------------------------------------------------------------------
        public void RemovePlayer( string username )
        {

        }
    }
}
