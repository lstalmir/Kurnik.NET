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
import { EBombermanApplicationFlags, EBombermanStatus, FBombermanPlayerDesc, FBombermanPlayerInitData } from "../bomberman";
import { EBombermanUniform } from "./shaders/shader_constants";
import { CBombermanExternalResources } from "./external_resources";

export class FBombermanWorldDesc
{
    public Name: string;
    public Width: number;
    public Height: number;
    public Flags: number;
    public BlockSize: number;
    public BlockSpacing: number;
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
    protected mBlockSize: number;
    protected mBlockSpacing: number;

    protected mInvWorldSizeUniformData: number[];

    //////////////////////////////////////////////////////////////////////////
    public constructor( context: CContext, worldDesc: FBombermanWorldDesc )
    {
        super( context, worldDesc.Name );
        this.mPlayersMaterial = new CMaterial( "PLAYERS_MATERIAL" );
        this.mPlayersMaterial.DiffuseColor = new FColor( 252 / 255, 230 / 255, 65 / 255 );
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
        this.mBlockSize = worldDesc.BlockSize;
        this.mBlockSpacing = worldDesc.BlockSpacing;

        // Load textures if not disabled
        if ( ( worldDesc.Flags & EBombermanApplicationFlags.NoTextures ) == 0 )
        {
            this.mDefaultBlocksMaterial.DiffuseTexture = new CTexture2D(
                context,
                CBombermanExternalResources.DefaultBlockTexturePath );
        }

        this.GenerateDefaultBlocks( context );

        this.mInvWorldSizeUniformData = new Array<number>();
        this.mInvWorldSizeUniformData.push( 1 / ( ( this.mBlockSize + this.mBlockSpacing ) * ( this.mWidth * 2 + 1 ) ) );
        this.mInvWorldSizeUniformData.push( 1 / ( ( this.mBlockSize + this.mBlockSpacing ) * ( this.mHeight * 2 + 1 ) ) );
    };
    
    //////////////////////////////////////////////////////////////////////////
    public Render( context: CContext, pass: ERenderPass ): void
    {
        if ( pass == ERenderPass.Geometry )
        {
            context.SetUniform2fv( EBombermanUniform.InvWorldSize, this.mInvWorldSizeUniformData );
        }

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
    public AddPlayer( context: CContext, desc: FBombermanPlayerDesc, initData?: FBombermanPlayerInitData ): EBombermanStatus
    {
        try
        {
            if ( this.Players.Get( desc.Id ) != null )
            { // Player with specified ID already exists
                return EBombermanStatus.AlreadyExists;
            }

            let scaledInitData: FBombermanPlayerInitData = null;
            if ( initData )
            {
                let spacedBlockSize = this.mBlockSpacing + this.mBlockSize;

                scaledInitData = new FBombermanPlayerInitData;
                scaledInitData.X = spacedBlockSize * initData.X;
                scaledInitData.Y = spacedBlockSize * initData.Y;
                scaledInitData.Rotation = initData.Rotation;
            }

            let player = new CBombermanPlayer( context, desc, scaledInitData );

            this.Players.Put( desc.Id, player );
            return EBombermanStatus.OK;
        }
        catch( e ) { }
        return EBombermanStatus.Error;
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
            
            let spacedBlockSize = this.mBlockSpacing + this.mBlockSize;
            
            let block = new CBombermanBlock(
                context, 
                id,
                "BOMBERMAN-BLOCK-" + id.toString(),
                this.mBlockSize,
                this.mBlockSize );

            block.Position.Set( new FVector(
                spacedBlockSize * x,
                spacedBlockSize * y ) );

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
            .SetWidth( this.mBlockSize )
            .SetHeight( this.mBlockSize );

        let blockInstances = new CInstancedObject(
            context,
            "GENERATED_BLOCKS",
            ERenderPass.Geometry,
            factory.GetBuilder() );

        let totalBlocks_w = this.mWidth * 2 + 1;
        let totalBlocks_h = this.mHeight * 2 + 1;

        let spacedBlockSize = this.mBlockSpacing + this.mBlockSize;
        
        for ( let i = 0; i < totalBlocks_w; ++i )
        {
            for ( let j = 0; j < totalBlocks_h; ++j )
            {
                if ( i == 0 ||
                     j == 0 ||
                     i == ( totalBlocks_w - 1 ) || 
                     j == ( totalBlocks_h - 1 ) ||
                     (i % 2 == 0 && j % 2 == 0) )
                {
                    blockInstances.AddInstance(
                        context,
                        new FVector(
                            spacedBlockSize * i,
                            spacedBlockSize * j ) );
                }
            }
        }
        blocks.push( blockInstances );
    };
};
