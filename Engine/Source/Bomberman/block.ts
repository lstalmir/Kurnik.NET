import { CContext } from "../game_engine/rendering/context";
import { ERenderPass } from "../game_engine/rendering/renderable";
import { CRectangle } from "../game_engine/geometry/2d/rectangle";
import { CRectangleFactory } from "../game_engine/geometry/2d/rectangle_factory";

export class CBombermanBlock extends CRectangle
{
    public readonly Id: number;
    public readonly Name: string;

    //////////////////////////////////////////////////////////////////////////
    public constructor( context: CContext, id: number, name: string, width: number = 50, height: number = 50, x: number = 0, y: number = 0 )
    {
        super( context, name + "_object", width, height, x, y, ERenderPass.Geometry );

        this.Id = id;
        this.Name = name;
    };
};

export class CBombermanBlockFactory extends CRectangleFactory
{
    protected mId: number;

    //////////////////////////////////////////////////////////////////////////
    public constructor()
    {
        super();
        this.Reset();
    };

    //////////////////////////////////////////////////////////////////////////
    public Reset(): CBombermanBlockFactory
    {
        super.Reset();
        this.mId = -1;
        return this;
    };

    //////////////////////////////////////////////////////////////////////////
    public SetId( id: number ): CBombermanBlockFactory
    {
        this.mId = id;
        return this;
    };

    //////////////////////////////////////////////////////////////////////////
    public Create( context: CContext ): CBombermanBlock
    {
        let block = new CBombermanBlock(
            context,
            this.mId,
            this.mName,
            this.mWidth,
            this.mHeight );

        block.Position.Set( this.mPosition );
        block.Rotation.Set( this.mRotation );
        block.TexcoordOffset.Set( this.mTexcoord );

        this.Reset();
        return block;
    };
};
