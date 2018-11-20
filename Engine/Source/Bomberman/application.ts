import { CApplication } from "../game_engine";
import { IBombermanApplication, EBombermanStatus, FBombermanApplicationDesc, EBombermanApplicationFlags, FBombermanPlayerDesc, FBombermanPlayerInitData } from "../bomberman"
import { CBombermanWorld, FBombermanWorldDesc } from "./world";
import { FVector } from "../game_engine/core/math/vector";
import { FRotator } from "../game_engine/core/math/rotator";
import { CBombermanBomb } from "./bomb";
import { CBombermanRenderer } from "./renderer";
import { CBombermanUserInterface, FBombermanUserInterfaceDesc } from "./user_interface";
import { CBombermanExternalResources } from "./external_resources";

export class CBombermanApplication
    extends CApplication
    implements IBombermanApplication
{
    protected mBlurStrength: number;
    protected mRenderLoop: number;
    protected mRefreshRateCb: ( fps: number ) => void;

    protected mPerfCaptureFrames: number;
    protected mPerfStart: number;
    protected mPerfEnd: number;

    protected mUserInterface: CBombermanUserInterface;

    //////////////////////////////////////////////////////////////////////////
    public constructor( appDesc: FBombermanApplicationDesc )
    {
        super(
            appDesc.CanvasID,
            ( appDesc.Flags & EBombermanApplicationFlags.Debug ) > 0,
            ( appDesc.Flags & EBombermanApplicationFlags.UseWebGL2 ) > 0 );

        CBombermanExternalResources.InitializePaths(
            ( appDesc.Flags & EBombermanApplicationFlags.UseGlobalPaths ) > 0 );

        let worldDesc = new FBombermanWorldDesc;
        worldDesc.Name = "BOMBERMAN-WORLD";
        worldDesc.Width = appDesc.Width;
        worldDesc.Height = appDesc.Height;
        worldDesc.Flags = appDesc.Flags;
        worldDesc.BlockSize = 40;
        worldDesc.BlockSpacing = 2;

        this.mWorld = new CBombermanWorld( this.mContext, worldDesc );
        this.mRenderer = new CBombermanRenderer( this.mContext );
        this.mTargetRefreshRate = 30;
        this.mPerfCaptureFrames = 0;

        let uiDesc = new FBombermanUserInterfaceDesc;
        uiDesc.PlayerEntry.Width = 200;
        uiDesc.PlayerEntry.Height = 50;
        uiDesc.PlayerEntry.Spacing = 5;

        this.mUserInterface = new CBombermanUserInterface( this.mContext, uiDesc );
        this.mUserInterface.Hide();

        ( <CBombermanRenderer>this.mRenderer ).SetBlurEnable( true );

        this.mBlurStrength = 10;
        ( <CBombermanRenderer>this.mRenderer ).SetBlurStrength( this.mBlurStrength );

        this.mRenderLoop = 0;
    };

    //////////////////////////////////////////////////////////////////////////
    public Run(): EBombermanStatus
    {
        if ( this.mRenderLoop == 0 )
        {
            this.mRenderLoop = setInterval( this.RenderLoop.bind( this ), 1000 / this.mTargetRefreshRate );
            //setTimeout( this.RenderLoop.bind( this ), 0 );
            return EBombermanStatus.OK;
        }
        return EBombermanStatus.AlreadyExists;
    };
    
    //////////////////////////////////////////////////////////////////////////
    protected RenderLoop(): void
    {
        {
            if ( this.mPerfCaptureFrames == 0 )
            {
                this.mPerfStart = Date.now();
            }
            
            this.mRenderer.Render( this.mWorld );

            if ( this.mBlurStrength > 0.1 )
            {
                this.mBlurStrength *= 0.95;
                ( <CBombermanRenderer>this.mRenderer ).SetBlurStrength( this.mBlurStrength );
            }
            else if ( this.mBlurStrength != 0 )
            {
                this.mBlurStrength = 0;
                ( <CBombermanRenderer>this.mRenderer ).SetBlurStrength( this.mBlurStrength );
                ( <CBombermanRenderer>this.mRenderer ).SetBlurEnable( false );

                this.mUserInterface.Show();
            }

            if ( this.mPerfCaptureFrames == this.mTargetRefreshRate )
            {
                this.mPerfEnd = Date.now();

                if ( this.mRefreshRateCb )
                {
                    this.mRefreshRateCb( this.mTargetRefreshRate * 1000 / ( this.mPerfEnd - this.mPerfStart ) );
                    this.mPerfCaptureFrames = 0;
                }
            }
            else
            {
                this.mPerfCaptureFrames++;
            }
        }
    };

    //////////////////////////////////////////////////////////////////////////
    public AddBlock( id: number, x: number, y: number ): EBombermanStatus
    {
        return ( <CBombermanWorld>this.mWorld ).AddBlock( this.mContext, id, x, y );
    };

    //////////////////////////////////////////////////////////////////////////
    public RemoveBlock( id: number ): EBombermanStatus
    {
        return EBombermanStatus.NotImplemented;
    };

    //////////////////////////////////////////////////////////////////////////
    public AddPlayer( desc: FBombermanPlayerDesc, initData?: FBombermanPlayerInitData ): EBombermanStatus
    {
        try
        {
            let result = ( <CBombermanWorld>this.mWorld ).AddPlayer(
                this.mContext, desc, initData );

            if ( EBombermanStatus.OK != result )
            { // Failed to add player to the world
                return result;
            }
            
            this.mUserInterface.AddPlayer(
                ( <CBombermanWorld>this.mWorld ).Players.Get( desc.Id ) );
            
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
            this.mUserInterface.RemovePlayer( id );
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
        clearInterval( this.mRenderLoop );

        return this.Run();
    };

    //////////////////////////////////////////////////////////////////////////
    public SetRefreshRateCallback( fpsCb: ( fps: number ) => void ): EBombermanStatus
    {
        this.mRefreshRateCb = fpsCb;
        return EBombermanStatus.OK;
    };
};
