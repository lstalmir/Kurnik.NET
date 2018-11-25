using Kurnik.Models;
using Kurnik.Models.Math;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kurnik.Services.Control
{
    public static class GamePlayerControl
    {
        public static void Update( this GamePlayer player )
        {
            if( player.IsAlive )
            {
                // New position = old position + (direction * speed)
                player.Position = player.Position.Add( player.Direction.Multiply( player.Speed ) );

                player.Direction = Vector.Zero;
                player.Speed = 0;
            }
        }

        public static void Kill( this GamePlayer player )
        {
            player.IsAlive = false;
            player.OnKilled( player );
        }
    }
}
