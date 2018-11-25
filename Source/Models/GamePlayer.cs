using Kurnik.Areas.Identity.Data;
using Kurnik.Models.Math;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kurnik.Models
{
    public delegate void OnGamePlayerKilled( GamePlayer player );

    public class GamePlayer : GameChild
    {
        public virtual User         User { get; set; }
        public Vector               Position { get; set; }
        public float                Rotation { get; set; }
        public Vector               Direction { get; set; }
        public float                Speed { get; set; }
        public GamePlayerColor      Color { get; set; }
        public bool                 IsAlive { get; set; }
        public OnGamePlayerKilled   OnKilled;

        public GamePlayer( Game game ) : base( game ) { }
    }
}
