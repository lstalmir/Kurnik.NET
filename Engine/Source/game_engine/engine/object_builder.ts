import { CContext } from "../rendering/context";
import { CObjectFactory } from "./object_factory";
import { CObject } from "./object";
import { FVector } from "../core/math/vector";
import { FRotator } from "../core/math/rotator";
import { FVector2D } from "../core/math/vector2d";

export abstract class CObjectBuilder<T extends CObject>
{
    protected mName: string;
    protected mPosition: FVector;
    protected mRotation: FRotator;
    protected mTexcoord: FVector2D;
    protected mRenderFlags: number;

    public constructor( name: string, position: FVector, rotation: FRotator, texcoord: FVector2D, renderFlags: number )
    {
        this.mName = name;
        this.mPosition = position;
        this.mRotation = rotation;
        this.mTexcoord = texcoord;
        this.mRenderFlags = renderFlags;
    };

    public abstract Create( context: CContext ): T;
    public abstract GetFactory(): CObjectFactory<T>;
};
