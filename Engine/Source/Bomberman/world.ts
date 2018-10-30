import { CWorld } from "../game_engine/engine/world";
import { CBombermanPlayer } from "./player";
import { CMap } from "../game_engine/core/map";
import { CBombermanBomb } from "./bomb";
import { CBombermanBlock, CBombermanBlockFactory } from "./block";
import { ERenderPass } from "../game_engine/rendering/renderable";
import { CContext } from "../game_engine/rendering/context";
import { CMaterial } from "../game_engine/engine/material";
import { CObject } from "../game_engine/engine/object";
import { FVector } from "../game_engine/core/math/vector";
import { FColor, EColor } from "../game_engine/core/color";
import { CInstancedObject } from "../game_engine/engine/instanced_object";

export class CBombermanWorld extends CWorld
{
    public Players: CMap<number, CBombermanPlayer>;
    public Bombs: CMap<number, CBombermanBomb>;
    public Blocks: CMap<number, CBombermanBlock>;

    protected mPlayersMaterial: CMaterial;
    protected mBombsMaterial: CMaterial;
    protected mBlocksMaterial: CMaterial;
    protected mDefaultBlocksMaterial: CMaterial;

    //////////////////////////////////////////////////////////////////////////
    public constructor( context: CContext, name: string )
    {
        super( context, name );
        this.mPlayersMaterial = new CMaterial( "PLAYERS_MATERIAL" );
        this.mBombsMaterial = new CMaterial( "BOMBS_MATERIAL" );
        this.mBlocksMaterial = new CMaterial( "BLOCKS_MATERIAL" );
        this.mDefaultBlocksMaterial = new CMaterial( "DEFAULT_BLOCKS_MATERIAL" );
        this.mDefaultBlocksMaterial.DiffuseColor = FColor.Get( EColor.Gray );
        this.Players = new CMap<number, CBombermanPlayer>();
        this.Bombs = new CMap<number, CBombermanBomb>();
        this.Blocks = new CMap<number, CBombermanBlock>();

        this.GenerateDefaultBlocks( context );
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

    //////////////////////////////////////////////////////////////////////////
    protected GenerateDefaultBlocks( context: CContext ): void
    {
        let blocks = this.mObjects.Get( this.mDefaultBlocksMaterial );

        if ( blocks == null )
        {
            blocks = new Array<CObject>();
            this.mObjects.Put( this.mDefaultBlocksMaterial, blocks );
        }

        let factory = new CBombermanBlockFactory()
            .SetWidth( 40 )
            .SetHeight( 40 );

        let blockInstances = new CInstancedObject(
            context,
            "GENERATED_BLOCKS",
            ERenderPass.Geometry,
            factory.GetBuilder() );

        for ( let i = 0; i < 15; ++i )
        {
            for ( let j = 0; j < 11; ++j )
            {
                if ( i == 0 || j == 0 || i == 14 || j == 10 ||
                     (i % 2 == 0 && j % 2 == 0) )
                {
                    blockInstances.AddInstance(
                        context,
                        new FVector( 42 * i, 42 * j, 0 ) );
                }
            }
        }
        blocks.push( blockInstances );
    };
};
