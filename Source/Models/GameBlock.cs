using Kurnik.Models.Math;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kurnik.Models
{
    public class GameBlock : GameChild
    {
        public Vector Position;

        public GameBlock( Game game ) : base( game ) { }
    }
}
