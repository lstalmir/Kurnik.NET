import { CApplication } from "../game_engine";
import { IBombermanApplication, EBombermanStatus } from "../bomberman"
import { CBombermanWorld } from "./world";
import { CBombermanPlayer } from "./player";
import { FVector } from "../game_engine/core/math/vector";
import { FRotator } from "../game_engine/core/math/rotator";
import { CBombermanBomb } from "./bomb";

export class CBombermanApplication
    extends CApplication
    implements IBombermanApplication
{
    //////////////////////////////////////////////////////////////////////////
    public constructor( canvasId: string )
    {
        super( canvasId );
        this.mWorld = new CBombermanWorld( this.mContext, "BOMBERMAN_WORLD" );
        this.mTargetRefreshRate = 60;
    };

    //////////////////////////////////////////////////////////////////////////
    public Run(): EBombermanStatus
    {
        this.RenderLoop();
        return EBombermanStatus.OK;
    };
    
    //////////////////////////////////////////////////////////////////////////
    protected RenderLoop(): void
    {
        setTimeout( this.RenderLoop.bind( this ), 1000 / this.mTargetRefreshRate );
        this.mRenderer.Render( this.mWorld );
    };

    //////////////////////////////////////////////////////////////////////////
    public AddBlock( id: number, x: number, y: number ): EBombermanStatus
    {
        return EBombermanStatus.NotImplemented;
    };

    //////////////////////////////////////////////////////////////////////////
    public RemoveBlock( id: number ): EBombermanStatus
    {
        return EBombermanStatus.NotImplemented;
    };

    //////////////////////////////////////////////////////////////////////////
    public AddPlayer( id: number, name: string, x: number, y: number, rotation: number ): EBombermanStatus
    {
        try
        {
            if ( ( <CBombermanWorld>this.mWorld ).Players.Get( id ) != null )
            { // Player with specified ID already exists.
                return EBombermanStatus.AlreadyExists;
            }

            let player = new CBombermanPlayer( this.mContext, id, name );
            player.Position.Set( new FVector( x, y, 0 ) );
            player.Rotation.Set( new FRotator( rotation ) );

            ( <CBombermanWorld>this.mWorld ).Players.Put( id, player );
            return EBombermanStatus.OK;
        }
        catch ( e ) { }
        return EBombermanStatus.Error;
    };

    //////////////////////////////////////////////////////////////////////////
    public RemovePlayer( id: number ): EBombermanStatus
    {
        try
        {
            if ( ( <CBombermanWorld>this.mWorld ).Players.Get( id ) == null )
            { // Player not found.
                return EBombermanStatus.NotFound;
            }

            ( <CBombermanWorld>this.mWorld ).Players.Remove( id );
            return EBombermanStatus.OK;
        }
        catch ( e ) { }
        return EBombermanStatus.Error;
    };

    //////////////////////////////////////////////////////////////////////////
    public SetPlayerTransform( id: number, x: number, y: number, rotation: number ): EBombermanStatus
    {
        let player = ( <CBombermanWorld>this.mWorld ).Players.Get( id );
        if ( player == null )
        { // Player not found.
            return EBombermanStatus.NotFound;
        }

        player.Position.Set( new FVector( x, y, 0 ) );
        player.Rotation.Set( new FRotator( rotation ) );
        return EBombermanStatus.OK;
    };

    //////////////////////////////////////////////////////////////////////////
    public AddBomb( id: number, x: number, y: number ): EBombermanStatus
    {
        try
        {
            if ( ( <CBombermanWorld>this.mWorld ).Bombs.Get( id ) != null )
            { // Bomb with specified ID already exists.
                return EBombermanStatus.AlreadyExists;
            }

            let bomb = new CBombermanBomb( this.mContext, id, "BOMB" );
            bomb.Position.Set( new FVector( x, y, 0 ) );

            ( <CBombermanWorld>this.mWorld ).Bombs.Put( id, bomb );
            return EBombermanStatus.OK;
        }
        catch ( e ) { }
        return EBombermanStatus.Error;
    };

    //////////////////////////////////////////////////////////////////////////
    public RemoveBomb( id: number ): EBombermanStatus
    {
        try
        {
            if ( ( <CBombermanWorld>this.mWorld ).Bombs.Get( id ) == null )
            { // Bomb not found.
                return EBombermanStatus.NotFound;
            }

            ( <CBombermanWorld>this.mWorld ).Bombs.Remove( id );
            return EBombermanStatus.OK;
        }
        catch ( e ) { }
        return EBombermanStatus.Error;
    };

    //////////////////////////////////////////////////////////////////////////
    public InvokeBomb( id: number ): EBombermanStatus
    {
        let bomb = ( <CBombermanWorld>this.mWorld ).Bombs.Get( id );
        if ( bomb == null )
        { // Bomb not found.
            return EBombermanStatus.NotFound;
        }

        bomb.Invoke();
        return EBombermanStatus.OK;
    };

    //////////////////////////////////////////////////////////////////////////
    public SetTargetRefreshRate( fps: number ): EBombermanStatus
    {
        if ( isNaN( fps ) ||
            !isFinite( fps ) ||
            Math.floor( fps ) != fps ||
            fps == 0 ||
            fps < -1 )
        { // Invalid FPS specified
            return EBombermanStatus.InvalidArgument;
        }

        this.mTargetRefreshRate = fps;
        return EBombermanStatus.OK;
    };
};
