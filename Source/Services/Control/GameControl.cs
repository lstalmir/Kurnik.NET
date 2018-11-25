using Kurnik.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kurnik.Services.Control
{
    public static class GameControl
    {
        public static void Start( this Game game )
        {
            if( !game.IsRunning )
            {
                game.IsRunning = true;
            }
        }

        public static void Update( this Game game )
        {
            if( game.IsRunning )
            {
                foreach( var player in game.Players )
                {
                    player.Update();
                }

                foreach( var bomb in game.Bombs )
                {
                    bomb.Update();
                }
            }
        }
    }
}
