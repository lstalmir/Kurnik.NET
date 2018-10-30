import { CObjectBuilder } from "../../engine/object_builder";
import { CRectangle } from "./rectangle";
import { CContext } from "../../rendering/context";
import { CRectangleFactory } from "./rectangle_factory";
import { FVector } from "../../core/math/vector";
import { FRotator } from "../../core/math/rotator";
import { FVector2D } from "../../core/math/vector2d";

export class CRectangleBuilder extends CObjectBuilder<CRectangle>
{
    protected mWidth: number;
    protected mHeight: number;
    protected mX: number;
    protected mY: number;

    public constructor( name: string, position: FVector, rotation: FRotator, texcoord: FVector2D, renderFlags: number, width: number, height: number, x: number, y: number )
    {
        super( name, position, rotation, texcoord, renderFlags );
        this.mWidth = width;
        this.mHeight = height;
        this.mX = x;
        this.mY = y;
    };

    public Create( context: CContext ): CRectangle
    {
        let rect = new CRectangle( context, this.mName, this.mWidth, this.mHeight, this.mX, this.mY, this.mRenderFlags );
        rect.Position.Set( this.mPosition );
        rect.Rotation.Set( this.mRotation );
        rect.TexcoordOffset.Set( this.mTexcoord );
        return rect;
    };

    public GetFactory(): CRectangleFactory
    {
        return new CRectangleFactory()
            .SetWidth( this.mWidth )
            .SetHeight( this.mHeight )
            .SetX( this.mX )
            .SetY( this.mY );
    };
};
