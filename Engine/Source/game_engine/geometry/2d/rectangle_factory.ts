import { CContext } from "../../rendering/context";
import { CRectangle } from "./rectangle";
import { CObjectFactory } from "../../engine/object_factory";
import { CRectangleBuilder } from "./rectangle_builder";

export class CRectangleFactory extends CObjectFactory<CRectangle>
{
    protected mWidth: number;
    protected mHeight: number;
    protected mX: number;
    protected mY: number;

    //////////////////////////////////////////////////////////////////////////
    public constructor()
    {
        super();
        this.Reset();
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Reset factory settings to defaults.
    public Reset(): CRectangleFactory
    {
        super.Reset();
        this.mWidth = 0;
        this.mHeight = 0;
        this.mX = 0;
        this.mY = 0;
        return this;
    };

    //////////////////////////////////////////////////////////////////////////
    public Create( context: CContext ): CRectangle
    {
        let rect = new CRectangle(
            context,
            this.mName,
            this.mWidth,
            this.mHeight,
            this.mX,
            this.mY,
            this.mRenderFlags );

        rect.Position.Set( this.mPosition );
        rect.Rotation.Set( this.mRotation );
        rect.TexcoordOffset.Set( this.mTexcoord );

        this.Reset();
        return rect;
    };

    //////////////////////////////////////////////////////////////////////////
    public GetBuilder(): CRectangleBuilder
    {
        return new CRectangleBuilder(
            this.mName,
            this.mPosition,
            this.mRotation,
            this.mTexcoord,
            this.mRenderFlags,
            this.mWidth,
            this.mHeight,
            this.mX,
            this.mY );
    };

    //////////////////////////////////////////////////////////////////////////
    public SetWidth( width: number ): CRectangleFactory
    {
        this.mWidth = width;
        return this;
    };

    //////////////////////////////////////////////////////////////////////////
    public SetHeight( height: number ): CRectangleFactory
    {
        this.mHeight = height;
        return this;
    };

    //////////////////////////////////////////////////////////////////////////
    public SetX( x: number ): CRectangleFactory
    {
        this.mX = x;
        return this;
    };

    //////////////////////////////////////////////////////////////////////////
    public SetY( y: number ): CRectangleFactory
    {
        this.mY = y;
        return this;
    };
};
