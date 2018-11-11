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
import { CTexture2D } from "../game_engine/engine/texture";
import { EBombermanApplicationFlags, EBombermanStatus } from "../bomberman";

export class FBombermanWorldDesc
{
    public Name: string;
    public Width: number;
    public Height: number;
    public Flags: number;
};

export class CBombermanWorld extends CWorld
{
    public Players: CMap<number, CBombermanPlayer>;
    public Bombs: CMap<number, CBombermanBomb>;
    public Blocks: CMap<number, CBombermanBlock>;

    protected mPlayersMaterial: CMaterial;
    protected mBombsMaterial: CMaterial;
    protected mBlocksMaterial: CMaterial;
    protected mDefaultBlocksMaterial: CMaterial;
    protected mWidth: number;
    protected mHeight: number;

    //////////////////////////////////////////////////////////////////////////
    public constructor( context: CContext, worldDesc: FBombermanWorldDesc )
    {
        super( context, worldDesc.Name );
        this.mPlayersMaterial = new CMaterial( "PLAYERS_MATERIAL" );
        this.mBombsMaterial = new CMaterial( "BOMBS_MATERIAL" );
        this.mBlocksMaterial = new CMaterial( "BLOCKS_MATERIAL" );
        this.mBlocksMaterial.DiffuseColor = new FColor( 147 / 255, 121 / 255, 116 / 255 );
        this.mDefaultBlocksMaterial = new CMaterial( "DEFAULT_BLOCKS_MATERIAL" );
        this.mDefaultBlocksMaterial.DiffuseColor = FColor.Get( EColor.Gray );
        this.Players = new CMap<number, CBombermanPlayer>();
        this.Bombs = new CMap<number, CBombermanBomb>();
        this.Blocks = new CMap<number, CBombermanBlock>();
        this.mWidth = worldDesc.Width;
        this.mHeight = worldDesc.Height;

        // Load textures if not disabled
        if ( ( worldDesc.Flags & EBombermanApplicationFlags.NoTextures ) == 0 )
        {
            this.mDefaultBlocksMaterial.DiffuseTexture = new CTexture2D( context, "images/default-block.png" );
        }

        this.GenerateDefaultBlocks( context );
    };
    
    //////////////////////////////////////////////////////////////////////////
    public Render( context: CContext, pass: ERenderPass ): void
    {
        super.Render( context, pass );

        if ( pass == ERenderPass.Geometry )
        {
            context.SetMaterial( this.mPlayersMaterial );
            for ( let player of this.Players.Values() )
                player.Render( context, pass );

            context.SetMaterial( this.mBombsMaterial );
            for ( let bomb of this.Bombs.Values() )
                bomb.Render( context, pass );

            context.SetMaterial( this.mBlocksMaterial );
            for ( let block of this.Blocks.Values() )
                block.Render( context, pass );
        }
    };

    //////////////////////////////////////////////////////////////////////////
    public AddBlock( context: CContext, id: number, x: number, y: number ): EBombermanStatus
    {
        try
        {
            if ( this.Blocks.Get( id ) != null )
            { // Block with specified ID already exists.
                return EBombermanStatus.AlreadyExists;
            }

            let totalBlocks_w = this.mWidth * 2 + 1;
            let totalBlocks_h = this.mHeight * 2 + 1;

            let width = 42 * totalBlocks_w;
            let height = 42 * totalBlocks_h;
            let screen_w = context.GetCanvas().width;
            let screen_h = context.GetCanvas().height;

            let block = new CBombermanBlock( context, id, "BOMBERMAN-BLOCK-" + id.toString(), 40, 40 );
            block.Position.Set( new FVector( ( screen_w - width ) / 2 + 42 * x, ( screen_h - height ) / 2 + 42 * y ) );

            this.Blocks.Put( id, block );
            return EBombermanStatus.OK;
        }
        catch ( e ) { }
        return EBombermanStatus.Error;
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

        let totalBlocks_w = this.mWidth * 2 + 1;
        let totalBlocks_h = this.mHeight * 2 + 1;

        let width = 42 * totalBlocks_w;
        let height = 42 * totalBlocks_h;
        let screen_w = context.GetCanvas().width;
        let screen_h = context.GetCanvas().height;

        for ( let i = 0; i < totalBlocks_w; ++i )
        {
            for ( let j = 0; j < totalBlocks_h; ++j )
            {
                if ( i == 0 || j == 0 || i == ( totalBlocks_w - 1 ) || j == ( totalBlocks_h - 1 ) ||
                     (i % 2 == 0 && j % 2 == 0) )
                {
                    blockInstances.AddInstance(
                        context,
                        new FVector( (screen_w - width) / 2 + 42 * i, (screen_h - height) / 2 + 42 * j, 0 ) );
                }
            }
        }
        blocks.push( blockInstances );
    };
};
