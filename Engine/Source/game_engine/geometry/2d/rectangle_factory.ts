import { CObject } from "../../engine/object";
import { CContext } from "../../rendering/context";
import { CRectangle } from "./rectangle";
import { ERenderPass } from "../../rendering/renderable";
import { CObjectFactory } from "../../engine/object_factory";

export class CRectangleFactory extends CObjectFactory<CRectangle>
{
    private x: number;
    private y: number;
    private w: number;
    private h: number;

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
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        return this;
    };

    //////////////////////////////////////////////////////////////////////////
    public Create( context: CContext ): CObject
    {
        let rect = new CRectangle(
            context,
            this.mName,
            this.w,
            this.h,
            this.x,
            this.y,
            this.mRenderFlags );

        rect.Position.Set( this.mPosition );
        rect.Rotation.Set( this.mRotation );
        rect.TexcoordOffset.Set( this.mTexcoord );

        this.Reset();
        return rect;
    };

    //////////////////////////////////////////////////////////////////////////
    public SetWidth( width: number ): CRectangleFactory
    {
        this.w = width;
        return this;
    };

    //////////////////////////////////////////////////////////////////////////
    public SetHeight( height: number ): CRectangleFactory
    {
        this.h = height;
        return this;
    };

    //////////////////////////////////////////////////////////////////////////
    public SetPosX( x: number ): CRectangleFactory
    {
        this.x = x;
        return this;
    };

    //////////////////////////////////////////////////////////////////////////
    public SetPosY( y: number ): CRectangleFactory
    {
        this.y = y;
        return this;
    };
};
