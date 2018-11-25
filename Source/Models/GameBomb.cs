using Kurnik.Models.Math;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kurnik.Models
{
    public delegate void OnGameBombInvoke( GameBomb bomb );

    public class GameBomb : GameChild
    {
        public Vector Position { get; set; }
        public DateTime PlacementTime { get; }
        public OnGameBombInvoke OnInvoke;

        public GameBomb( Game game ) : base( game ) { }
    }
}
