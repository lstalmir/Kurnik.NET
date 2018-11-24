import { FColor, EColor } from "../game_engine/core/color";
import { EBombermanPlayerColor } from "../bomberman";

export class FBombermanColor extends FColor
{
    public static GetBombermanColor( color: EBombermanPlayerColor ): FBombermanColor
    {
        switch ( color )
        {
            case EBombermanPlayerColor.Red: return new FBombermanColor( 1, 0, 0 );
            case EBombermanPlayerColor.Green: return new FBombermanColor( 0, 1, 0 );
            case EBombermanPlayerColor.Blue: return new FBombermanColor( 0, 0, 1 );
            case EBombermanPlayerColor.Yellow: return new FBombermanColor( 1, 1, 0 );
            case EBombermanPlayerColor.Cyan: return new FBombermanColor( 0, 1, 1 );
            case EBombermanPlayerColor.Magenta: return new FBombermanColor( 1, 0, 1 );
        }
        return new FBombermanColor( 0, 0, 0 );
    };

    public GetCSSString(): string
    {
        return '#' + this.Hex( this.r ) + this.Hex( this.g ) + this.Hex( this.b );
    };

    protected Hex( x: number ): string
    {
        let str = Math.floor( x * 255 ).toString( 16 );
        if ( str.length == 1 )
            str = '0' + str;
        return str;
    };
};
