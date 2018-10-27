import { CWorld } from "../game_engine/engine/world";
import { CBombermanPlayer } from "./player";
import { CMap } from "../game_engine/core/map";
import { CBombermanBomb } from "./bomb";
import { CBombermanBlock } from "./block";
import { ERenderPass } from "../game_engine/rendering/renderable";
import { CContext } from "../game_engine/rendering/context";
import { CMaterial } from "../game_engine/engine/material";

export class CBombermanWorld extends CWorld
{
    public Players: CMap<number, CBombermanPlayer>;
    public Bombs: CMap<number, CBombermanBomb>;
    public Blocks: CMap<number, CBombermanBlock>;

    protected mPlayersMaterial: CMaterial;
    protected mBombsMaterial: CMaterial;
    protected mBlocksMaterial: CMaterial;

    //////////////////////////////////////////////////////////////////////////
    public constructor( context: CContext, name: string )
    {
        super( context, name );
        this.mPlayersMaterial = new CMaterial( "PLAYERS_MATERIAL" );
        this.mBombsMaterial = new CMaterial( "BOMBS_MATERIAL" );
        this.mBlocksMaterial = new CMaterial( "BLOCKS_MATERIAL" );
        this.Players = new CMap<number, CBombermanPlayer>();
        this.Bombs = new CMap<number, CBombermanBomb>();
        this.Blocks = new CMap<number, CBombermanBlock>();
    };
    
    //////////////////////////////////////////////////////////////////////////
    public Render( context: CContext, pass: ERenderPass ): void
    {
        super.Render( context, pass );

        context.SetMaterial( this.mPlayersMaterial );
        for ( let player of this.Players.Values() )
            player.Render( context, pass );

        context.SetMaterial( this.mBombsMaterial );
        for ( let bomb of this.Bombs.Values() )
            bomb.Render( context, pass );

        context.SetMaterial( this.mBlocksMaterial );
        for ( let block of this.Blocks.Values() )
            block.Render( context, pass );
    };
};
