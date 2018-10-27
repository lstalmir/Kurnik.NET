import { CObject } from "./object";
import { CContext } from "../rendering/context";
import { FVector } from "../core/math/vector";
import { FVector2D } from "../core/math/vector2d";
import { ERenderPass } from "../rendering/renderable";
import { FRotator } from "../core/math/rotator";

export abstract class CObjectFactory<T extends CObject>
{
    protected mName: string;
    protected mPosition: FVector;
    protected mRotation: FRotator;
    protected mTexcoord: FVector2D;
    protected mRenderFlags: number;

    public constructor()
    {
        this.Reset();
    };

    public SetName( name: string ): CObjectFactory<T>
    {
        if ( name )
            this.mName = name;
        return this;
    };

    public SetPosition( position: FVector ): CObjectFactory<T>
    {
        if ( position )
            this.mPosition.Set( position );
        return this;
    };

    public SetRotation( rotation: FRotator ): CObjectFactory<T>
    {
        if ( rotation )
            this.mRotation.Set( rotation );
        return this;
    };

    public SetTexcoordOffset( texcoord: FVector2D ): CObjectFactory<T>
    {
        if ( texcoord )
            this.mTexcoord.Set( texcoord );
        return this;
    };

    public SetRenderFlag( renderFlag: ERenderPass ): CObjectFactory<T>
    {
        this.mRenderFlags |= renderFlag;
        return this;
    };

    public SetRenderFlags( renderFlags: number ): CObjectFactory<T>
    {
        this.mRenderFlags = renderFlags;
        return this;
    };

    public Reset(): CObjectFactory<T>
    {
        this.mName = "";
        this.mPosition = new FVector();
        this.mRotation = new FRotator();
        this.mTexcoord = new FVector2D();
        this.mRenderFlags = 0;
        return this;
    };

    public abstract Create( context: CContext ): T;
};
