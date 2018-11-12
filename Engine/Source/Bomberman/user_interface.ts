import { IRenderable, ERenderPass } from "../game_engine/rendering/renderable";
import { CContext } from "../game_engine/rendering/context";
import { CRectangle } from "../game_engine/geometry/2d/rectangle";
import { CBombermanPlayer } from "./player";
import { CRenderTarget } from "../game_engine/rendering/render_target";

class FBombermanPlayerEntryDesc
{
    Width: number;
    Height: number;
    Spacing: number;
};

export class FBombermanUserInterfaceDesc
{
    PlayerEntry: FBombermanPlayerEntryDesc;
};

class CBombermanPlayerEntry extends CRectangle
{
    protected mPlayer: CBombermanPlayer;
    
    constructor( context: CContext, player: CBombermanPlayer, desc: FBombermanUserInterfaceDesc )
    {
        super( context, 
            player.Name + '-PLAYER-ENTRY',
            desc.PlayerEntry.Width,
            desc.PlayerEntry.Height );

        this.mPlayer = player;
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
        return new CBombermanPlayerEntry( this.mContext, player, this.mDesc );
    };
};

export class CBombermanUserInterface implements IRenderable
{
    protected mPlayers: CBombermanPlayerEntry[];
    protected mPlayerEntryFactory: CBombermanPlayerEntryFactory;


    public constructor( context: CContext, desc: FBombermanUserInterfaceDesc )
    {
        this.mPlayers = new Array<CBombermanPlayerEntry>();
        this.mPlayerEntryFactory = new CBombermanPlayerEntryFactory( context, desc );
    };

    public Render( context: CContext, renderPass: ERenderPass ): void 
    {
        for ( let playerEntry of this.mPlayers )
        {
            playerEntry.Render( context, renderPass );
        }
    };

    public AddPlayer( player: CBombermanPlayer ): void
    {
        this.mPlayers.push( this.mPlayerEntryFactory.CreateEntry( player ) );
    };
};


