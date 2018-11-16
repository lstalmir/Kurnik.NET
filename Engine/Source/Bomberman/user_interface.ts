import { CContext } from "../game_engine/rendering/context";
import { CBombermanPlayer, FBombermanPlayerDesc } from "./player";
import { CBombermanExternalResources } from "./external_resources";

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

class CBombermanPlayerEntry
{
    protected mPlayer: CBombermanPlayer;
    protected mHTMLElement: HTMLDivElement;
    
    constructor( context: CContext, player: CBombermanPlayer, desc: FBombermanPlayerEntryDesc )
    {
        this.mPlayer = player;

        let playerName = document.createElement( "span" );
        playerName.classList.add( "BOMBERMAN-USER-INTERFACE-PLAYER-ENTRY-PLAYER-NAME-CLASS" );
        playerName.innerText = player.Name;

        let playerAvatar = document.createElement( "img" );
        playerAvatar.classList.add( "BOMBERMAN-USER-INTERFACE-PLAYER-ENTRY-PLAYER-AVATAR-CLASS" );
        playerAvatar.src = player.AvatarSrc;

        this.mHTMLElement = document.createElement( "div" );
        this.mHTMLElement.style.height = desc.Height.toString() + "px";
        this.mHTMLElement.style.fontSize = ( desc.Height * 0.4 ).toString() + "px";
        this.mHTMLElement.classList.add( "BOMBERMAN-USER-INTERFACE-PLAYER-ENTRY-CLASS" );
        this.mHTMLElement.appendChild( playerAvatar );
        this.mHTMLElement.appendChild( playerName );
    };

    public GetHTMLElement(): HTMLElement
    {
        return this.mHTMLElement;
    };
};

class CBombermanPlayerEntrySeparator
{
    protected mHTMLElement: HTMLDivElement;

    constructor()
    {
        this.mHTMLElement = document.createElement( "div" );
        this.mHTMLElement.classList.add( "BOMBERMAN-USER-INTERFACE-PLAYER-ENTRY-SEPARATOR-CLASS" );
    };

    public GetHTMLElement(): HTMLElement
    {
        return this.mHTMLElement;
    };
};

class CBombermanPlayerEntryFactory
{
    protected mContext: CContext;
    protected mDesc: FBombermanUserInterfaceDesc;

    public constructor( context: CContext, desc: FBombermanUserInterfaceDesc )
    {
        this.mContext = context;
        this.mDesc = desc;
    };

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

    public Show(): void
    {
        this.mUserInterfaceDivElement.style.visibility = "visible";
    };

    public Hide(): void
    {
        this.mUserInterfaceDivElement.style.visibility = "hidden";
    };

    public Update(): void 
    {
        
    };

    public AddPlayer( player: CBombermanPlayer ): void
    {
        let entry = this.mPlayerEntryFactory.CreateEntry( player );

        // Separate playler entries
        if ( this.mPlayers.length > 0 )
        {
            this.mUserInterfaceDivElement.appendChild( 
                new CBombermanPlayerEntrySeparator().GetHTMLElement() );
        }

        this.mPlayers.push( entry );
        this.mUserInterfaceDivElement.appendChild( entry.GetHTMLElement() );
    };

    protected ImportStylesheet( location: string ): void
    {
        let link = document.createElement( "link" );
        link.rel = "stylesheet";
        link.href = location;

        document.head.appendChild( link );
    };
};


