import { CContext } from "../game_engine/rendering/context";
import { CBombermanPlayer } from "./player";
import { CBombermanExternalResources } from "./external_resources";
import { FAsyncTaskQueue } from "../game_engine/core/time";

interface IUserInterfaceHTMLElement
{
    readonly CSSClass: string;
};

interface IUserInterfaceAnimatedHTMLElement extends IUserInterfaceHTMLElement
{
    readonly CSSAnimationClass: string;
    readonly CSSAnimationDuration: number;
    PlayAnimation(): void;
};

class FBombermanPlayerEntryDesc
{
    Width: number;
    Height: number;
    Spacing: number;
};

export class FBombermanUserInterfaceDesc
{
    PlayerEntry: FBombermanPlayerEntryDesc = new FBombermanPlayerEntryDesc;
};

class CBombermanPlayerEntry implements IUserInterfaceAnimatedHTMLElement
{
    readonly CSSClass: string = "BOMBERMAN-USER-INTERFACE-PLAYER-ENTRY-CLASS";
    readonly CSSAnimationClass: string = "BOMBERMAN-USER-INTERFACE-PLAYER-ENTRY-ANIMATION-CLASS";
    readonly CSSAnimationDuration: number = 0.3;

    protected mPlayer: CBombermanPlayer;
    protected mHTMLElement: HTMLDivElement;

    //////////////////////////////////////////////////////////////////////////
    constructor( context: CContext, player: CBombermanPlayer, desc: FBombermanPlayerEntryDesc )
    {
        this.mPlayer = player;

        let playerName = document.createElement( "span" );
        playerName.classList.add( "BOMBERMAN-USER-INTERFACE-PLAYER-ENTRY-PLAYER-NAME-CLASS" );
        playerName.innerHTML = player.Name;

        let playerAvatar = document.createElement( "img" );
        playerAvatar.classList.add( "BOMBERMAN-USER-INTERFACE-PLAYER-ENTRY-PLAYER-AVATAR-CLASS" );
        playerAvatar.src = player.AvatarSrc;
        playerAvatar.style.borderLeftColor = player.Color.GetCSSString();

        this.mHTMLElement = document.createElement( "div" );
        this.mHTMLElement.style.height = desc.Height.toString() + "px";
        this.mHTMLElement.style.fontSize = ( desc.Height * 0.4 ).toString() + "px";
        this.mHTMLElement.style.animationDuration = this.CSSAnimationDuration + "s";
        this.mHTMLElement.classList.add( this.CSSClass, this.CSSAnimationClass );
        this.mHTMLElement.appendChild( playerAvatar );
        this.mHTMLElement.appendChild( playerName );
    };

    //////////////////////////////////////////////////////////////////////////
    public GetHTMLElement(): HTMLElement
    {
        return this.mHTMLElement;
    };

    //////////////////////////////////////////////////////////////////////////
    public GetPlayer(): CBombermanPlayer
    {
        return this.mPlayer;
    };

    //////////////////////////////////////////////////////////////////////////
    public PlayAnimation(): void
    {
        this.mHTMLElement.classList.remove( this.CSSAnimationClass );
        void this.mHTMLElement.offsetHeight;
        this.mHTMLElement.classList.add( this.CSSAnimationClass );
    };

    //////////////////////////////////////////////////////////////////////////
    public Hide(): void
    {
        this.mHTMLElement.style.visibility = "hidden";
    };

    //////////////////////////////////////////////////////////////////////////
    public Show(): void
    {
        this.mHTMLElement.style.visibility = "visible";
    };
};

class CBombermanPlayerEntrySeparator implements IUserInterfaceHTMLElement
{
    readonly CSSClass: string = "BOMBERMAN-USER-INTERFACE-PLAYER-ENTRY-SEPARATOR-CLASS";

    protected mHTMLElement: HTMLDivElement;

    //////////////////////////////////////////////////////////////////////////
    constructor()
    {
        this.mHTMLElement = document.createElement( "div" );
        this.mHTMLElement.classList.add( this.CSSClass );
    };

    //////////////////////////////////////////////////////////////////////////
    public GetHTMLElement(): HTMLElement
    {
        return this.mHTMLElement;
    };
};

class CBombermanPlayerEntryFactory
{
    protected mContext: CContext;
    protected mDesc: FBombermanUserInterfaceDesc;

    //////////////////////////////////////////////////////////////////////////
    public constructor( context: CContext, desc: FBombermanUserInterfaceDesc )
    {
        this.mContext = context;
        this.mDesc = desc;
    };

    //////////////////////////////////////////////////////////////////////////
    public CreateEntry( player: CBombermanPlayer ): CBombermanPlayerEntry
    {
        return new CBombermanPlayerEntry( this.mContext, player, this.mDesc.PlayerEntry );
    };
};

export class CBombermanUserInterface
{
    protected mPlayers: CBombermanPlayerEntry[];
    protected mPlayerEntryFactory: CBombermanPlayerEntryFactory;

    protected mUserInterfaceDivElement: HTMLDivElement;

    //////////////////////////////////////////////////////////////////////////
    public constructor( context: CContext, desc: FBombermanUserInterfaceDesc )
    {
        this.mPlayers = new Array<CBombermanPlayerEntry>();
        this.mPlayerEntryFactory = new CBombermanPlayerEntryFactory( context, desc );

        let canvas = context.GetCanvas();

        this.mUserInterfaceDivElement = document.createElement( "div" );
        this.mUserInterfaceDivElement.classList.add( "BOMBERMAN-USER-INTERFACE-CONTAINER-CLASS" );
        this.mUserInterfaceDivElement.style.top = ( 0.215 * canvas.height ).toString() + "px";
        this.mUserInterfaceDivElement.style.left = ( 0.75 * canvas.width ).toString() + "px";
        this.mUserInterfaceDivElement.style.height = ( 0.715 * canvas.height ).toString() + "px";
        this.mUserInterfaceDivElement.style.width = ( 0.210938 * canvas.width ).toString() + "px";
        this.mUserInterfaceDivElement.style.padding = "1px";
        canvas.parentElement.appendChild( this.mUserInterfaceDivElement );

        this.ImportStylesheet( CBombermanExternalResources.UserInterfaceStyleSheetPath );
    };

    //////////////////////////////////////////////////////////////////////////
    public Show(): void
    {
        if ( this.IsHidden() )
        {
            this.mUserInterfaceDivElement.style.visibility = "visible";

            // We want to replay the animation of all player entries
            if ( this.mPlayers.length > 0 )
            {
                let taskQueue = new FAsyncTaskQueue();

                for ( let playerEntry of this.mPlayers )
                {
                    taskQueue.SubmitTask( function ()
                    {
                        playerEntry.Show();
                        playerEntry.PlayAnimation();
                    } );
                }

                taskQueue.SetExecuteAsyncInterval( this.mPlayers[0].CSSAnimationDuration );
                taskQueue.ExecuteAsync();
            }
        }
    };

    //////////////////////////////////////////////////////////////////////////
    public Hide(): void
    {
        this.mUserInterfaceDivElement.style.visibility = "hidden";

        for ( let playerEntry of this.mPlayers )
            playerEntry.Hide();
    };

    //////////////////////////////////////////////////////////////////////////
    public AddPlayer( player: CBombermanPlayer ): void
    {
        let entry = this.mPlayerEntryFactory.CreateEntry( player );

        // Separate playler entries
        if ( this.mPlayers.length > 0 )
        {
            this.mUserInterfaceDivElement.appendChild( 
                new CBombermanPlayerEntrySeparator().GetHTMLElement() );
        }

        if ( this.mUserInterfaceDivElement.style.visibility == "hidden" )
            entry.Hide();

        this.mPlayers.push( entry );
        this.mUserInterfaceDivElement.appendChild( entry.GetHTMLElement() );
    };

    //////////////////////////////////////////////////////////////////////////
    public RemovePlayer( id: number ): void
    {
        // Get entry index
        let entryIndex = 0;
        for ( let playerEntry of this.mPlayers )
        {
            if ( playerEntry.GetPlayer().Id == id )
                break;
            entryIndex++;
        }

        if ( entryIndex == this.mPlayers.length )
            return;

        this.mUserInterfaceDivElement.children.item( 2 * entryIndex ).remove();
        this.mPlayers = this.mPlayers.filter( ( c ) => c.GetPlayer().Id != id );

        if ( entryIndex == 0 && this.mPlayers.length > 1 )
        { // Remove the entry and separator after it
            this.mUserInterfaceDivElement.children.item( 0 ).remove();
            return;
        }

        if ( this.mPlayers.length > 0 )
        { // Remove the separator before the entry
            this.mUserInterfaceDivElement.children.item( 2 * entryIndex - 1 ).remove();
            return;
        }

        return;
    };

    //////////////////////////////////////////////////////////////////////////
    protected ImportStylesheet( location: string ): void
    {
        let link = document.createElement( "link" );
        link.rel = "stylesheet";
        link.href = location;

        document.head.appendChild( link );
    };

    //////////////////////////////////////////////////////////////////////////
    protected IsHidden(): boolean
    {
        return this.mUserInterfaceDivElement.style.visibility == "hidden";
    };
};
