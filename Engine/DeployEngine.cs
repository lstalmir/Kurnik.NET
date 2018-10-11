using System;
using System.IO;

namespace KurnikNET.Engine
{
    class EngineDeployAction
    {
        static int Main( string[] args )
        {
            EngineDeployAction action = 
                new EngineDeployAction();

            return action.Run( args );
        }

        private int Run( string[] args )
        {
            try
            {
                File.Copy( args[0], args[1], true );
                Console.WriteLine( "Engine deployed to: " + args[1] );
                return 0;
            }
            catch( Exception ex )
            {
                Console.WriteLine( "Failed to deploy engine: " + ex.Message );
            }
            return 1;
        }
    }
}