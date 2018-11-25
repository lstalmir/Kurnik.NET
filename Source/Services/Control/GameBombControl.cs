using Kurnik.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kurnik.Services.Control
{
    public static class GameBombControl
    {
        public static void Update( this GameBomb bomb )
        {
            if( DateTime.Now.Subtract( bomb.PlacementTime ).Milliseconds > 3000 )
            {
                bomb.OnInvoke( bomb );
            }
        }
    }
}
