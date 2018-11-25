using Kurnik.Areas.Identity.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kurnik.Models
{
    public class Game
    {
        public int                  ID { get; }
        public Lobby                Lobby { get; }
        public IList<GamePlayer>    Players { get; } = new List<GamePlayer>();
        public IList<GameBlock>     Blocks { get; } = new List<GameBlock>();
        public IList<GameBomb>      Bombs { get; } = new List<GameBomb>();
        public bool                 IsRunning { get; set; }
        public int                  Width { get; }
        public int                  Height { get; }

        public Game( Lobby lobby, int width, int height )
        {
            ID = lobby.ID;
            Lobby = lobby;
            IsRunning = false;
            Width = width;
            Height = height;
        }
    }

    public abstract class GameChild
    {
        public Game Game { get; }

        public GameChild( Game game ) { Game = game; }
    }
}
